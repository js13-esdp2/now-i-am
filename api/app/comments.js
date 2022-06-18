const express = require('express');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');
const Post = require('../models/Post');


const router = express.Router();

router.get('/:id', async (req, res, next) =>{
  try {
    const comments = await Comment.find({post: req.params.id}).populate('user', 'displayName photo');
    res.send(comments);
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const commentData = {
      user: req.body.userId,
      text: req.body.text,
      post: req.body.postId
    }
    const comment = await new Comment(commentData);
    await comment.save();
    const comments = await Comment.find({post: req.body.postId}).populate('user', 'displayName photo');
    res.send(comments);
  } catch (e) {
    next(e);
  }
})

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.send({message: 'ok'});
    }
    if (req.user.role === 'user') {
      if (!comment.user.equals(req.user._id)) {
        return res.status(403).send({error: 'У Вас нет на это прав'});
      }
    }
    await comment.remove();
    res.send(comment);
  }
  catch (e) {
    next(e);
  }
});

module.exports = router;
