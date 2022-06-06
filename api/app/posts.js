const express = require('express');
const multer = require('multer');
const path = require('path');
const {nanoid} = require('nanoid');
const mongoose = require('mongoose');

const config = require('../config');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname))
  }
});

const upload = multer({storage});

router.get('/', async (req, res, next) => {
  try {
    const query = { isVisible: true };
    const projection = {};

    const users = await User.find(req.query);
    query['user'] = users.map(user => {
      return user._id;
    });

    // if (req.query.user) {
    //   query['user'] = req.query.user;
    // }

    if (req.query.title) {
      query['$text'] = { $search: req.query.title };
      projection['score'] = { $meta: 'textScore' };
    }

    const posts = await Post.find(query, projection)
      .populate('user', 'displayName photo')
      .sort(projection);

    return res.send(posts);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'displayName');
    if (!post) {
      return res.status(404).send({message: 'Нет такого поста'});
    }
    return res.send(post);
  } catch (e) {
    next(e);
  }
});

router.post('/', upload.single('content'), async (req, res, next) => {
  try {

    const time = JSON.parse(req.body.time);
    const timer = (time.hours * 3600) + (time.minutes * 60);
    const invisibleAtUnixTime = (Math.round((new Date().getTime() / 1000)) + timer);
    const invisibleDate = new Date((invisibleAtUnixTime * 1000)).toString();

    const postData = {
      user: req.body.user,
      title: req.body.title,
      content: null,
      datetime: new Date().toISOString(),
      invisibleDate: invisibleDate,
      invisibleAtUnixTime: invisibleAtUnixTime,
      time: time,
      geolocation: null
    }


    if (req.body.geolocation) {
      const geolocation = JSON.parse(req.body.geolocation);
      postData.geolocation = {
        lat: geolocation.lat,
        lng: geolocation.lng
      }
    }

    if (req.file) {
      postData.content = req.file.filename;
    }
    if (req.body.content) {
      const base64Data = req.body.content.replace(/^data:image\/jpeg;base64,/, '');
      const imagePath = `${nanoid()}.jpeg`
      require('fs').writeFile(`public/uploads/${imagePath}`, base64Data, 'base64', function (err) {
        console.log(err);
      });
      postData.content = imagePath;
    }

    let category = await Category.findOne({ title: postData.title });
    if (!category) {
      category = new Category({ title: postData.title, posts: 1 });
    } else category.posts++;

    await category.save();
    postData.categoryId = category._id;

    const post = new Post(postData);
    await post.save();

    return res.send(
      {message: 'Created new post', id: post._id});
  } catch (e) {
    next(e);
  }
});

router.post('/:id/like', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'displayName');
    if (!post) {
      return res.status(404).send({error: 'Page not found'});
    }

    const checkLike = post.likes.find((like) => like.user.equals(req.user._id));
    if (checkLike) {
      return res.send(post);
    }

    post.likes.push({user: req.user._id});
    await post.save();

    const category = await Category.findById(post.categoryId);
    if (category) {
      category.likes++;
      await category.save();
    }

    res.send(post);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return next(e);
    }

    next(e);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.send({message: 'ok'});
    }
    if (req.user.role === 'user'){
      if (!post.user.equals(req.user._id)) {
        return res.status(403).send({error: 'У Вас нет на это прав'});
      }
    }
    await post.remove();
    res.send(post);
  } catch (e) {
    next(e);
  }
});

router.get('/my-history-posts/:id', auth, async (req, res, next) => {
  try {
    const posts = await Post.find({user: req.params.id})
    res.send(posts);
  } catch (e) {
    next(e);
  }
});


const checkIfPostsAreOnline = () => {
  setInterval(async () => {
    let currentUnixTime = Math.round((new Date().getTime() / 1000));

    const posts = await Post.find();
    const postsData = [...posts];

    for (let i = 0; i < postsData.length; i++) {
      const post = postsData[i];
      if (currentUnixTime > post.invisibleAtUnixTime) {
        const updatedPost = await Post.findByIdAndUpdate(post._id, {isVisible: false});
      }
    }
  }, 6000);
}

checkIfPostsAreOnline();

module.exports = router;
