const express = require('express');
const multer = require('multer');
const path = require('path');
const { nanoid } = require('nanoid');
const config = require('../config');
const Post = require("../models/Post");

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
    if (req.query.user){
      query.user = {_id: req.query.user}
    }

    const posts = await Post.find(query).populate('user', 'displayName');

    return res.send(posts);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
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

    const post = new Post(postData);
    await post.save();

    return res.send(
      {message: 'Created new post', id: post._id});
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async(req, res, next) =>{
  try{

    const post = await Post.deleteOne({_id: req.params.id});
    return res.send(post);
  }catch(e){
    next(e);
  }
});

module.exports = router;
