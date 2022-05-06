const express = require('express');
const multer = require('multer');
const path = require('path');
const { nanoid } = require('nanoid');
const mongoose = require('mongoose');

const config = require('../config');
const Post = require("../models/Post");
const auth = require('../middleware/auth');

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
    const query = {};
    const andQuery = [];

    if (req.query.user) {
      andQuery.push({user: req.query.user});
    }

    if (req.query.title) {
      andQuery.push({title: req.query.title});
    }

    if (andQuery.length) {
      query['$and'] = andQuery;
    }

    const posts = await Post.find(query).populate('user', 'displayName');

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

    const postData = {
      user: req.body.user,
      title: req.body.title,
      datetime: new Date().toISOString(),
      time: JSON.parse(req.body.time),
      content: null,
    }

    if (req.file) {
      postData.content = req.file.filename;
    }
    if (req.body.content) {
        const base64Data = req.body.content.replace(/^data:image\/jpeg;base64,/, "");
        const imagePath = `${nanoid()}.jpeg`
        require("fs").writeFile( `public/uploads/${imagePath}`, base64Data, 'base64', function(err) {
            console.log(err);
        });
        postData.content = imagePath;
    }

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
      return res.status(404).send({ error: 'Page not found' });
    }

    const checkLike = post.likes.find((like) => like.user.equals(req.user._id));
    if (checkLike) {
      return res.send(post);
    }

    post.likes.push({ user: req.user._id });
    await post.save();

    res.send(post);
  } catch(e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return next(e);
    }

    next(e);
  }
});

router.delete('/:id', auth ,async(req, res, next) =>{
  try{
    const post = await Post.findById(req.params.id);
    if(!post) {
      return res.send({message: 'ok'});
    }
    if(!post.user.equals(req.user._id)) {
      return res.status(403).send({error: 'У Вас нет на это прав'});
    }
    await post.remove();
    res.send(post);
  }catch(e){
    next(e);
  }
});

router.get('/my-history-posts/:id', auth, async (req, res, next) => {
  try {
    const posts= await Post.find({user: req.params.id})
    res.send(posts);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
