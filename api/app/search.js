const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res, next) => {
  try {
    const users = await User.find(req.query);
    const usersId = users.map(user => {
      return user._id;
    });
    const posts = await Post.find({title: {$in: req.query.title}, user: usersId});
    return res.send(posts);
  } catch (e) {
    return next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const posts = await Post.find({title: req.body.searchData});
    const usersId = posts.map(post => {
      return post.user;
    });



    const users = await User.find({_id: {$in: usersId}});

    return res.send(users);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }

    return next(e);
  }
});

module.exports = router;
