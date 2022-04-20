const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require("../models/Post");

const router = express.Router();


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
