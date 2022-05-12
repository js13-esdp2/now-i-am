const express = require('express');
const mongoose = require('mongoose');

const Friends = require("../models/Friends");
const auth = require('../middleware/auth');

const router = express.Router();


router.get('/', auth, async (req, res, next) => {
  try {

    const friends = await Friends.find({user: req.user._id}).populate('friend', 'displayName photo');

    return res.send(friends);
  } catch (e) {
    next(e);
  }
});


router.post('/', auth, async (req, res, next) => {
  try {

    const friendData = {
      user: req.user._id,
      friend: req.body.userId,
    }

    const checkFriend =  await Friends.findOne({user: req.user._id, friend: req.body.userId});

    if (checkFriend) {
      return res.status(400).send({error: 'Запрос отправлен повторно'});
    }

    const data = new Friends(friendData);
    await data.save();

    return res.send(data);
  } catch(e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return next(e);
    }
    next(e);
  }
});

router.delete('/:id', auth, async(req, res, next) =>{
  try{
    const findFriend = await Friends.deleteOne({user: req.user._id, friend: req.params.id});

    res.send(findFriend)
  }catch(e){
    next(e);
  }
});

module.exports = router;
