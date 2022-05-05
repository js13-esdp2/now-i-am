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
      friend: req.body.user,
    }

    const data = new Friends(friendData);
    await data.save();

    return res.send({message: 'Добавление прошло успешно!'});
  } catch(e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return next(e);
    }
    next(e);
  }
});

router.delete('/:id', async(req, res, next) =>{
  try{
    const friend = await Friends.deleteOne({_id: req.params.id});
    return res.send(friend);
  }catch(e){
    next(e);
  }
});

module.exports = router;
