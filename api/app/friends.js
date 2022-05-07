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

router.delete('/:id', auth, async(req, res, next) =>{
  try{
    const findFriend = await Friends.findOne({friend: req.params.id});
    if(!findFriend) {
      return res.send({message: 'ok'});
    }
    if(!findFriend.user.equals(req.user._id)) {
      return res.status(403).send({error: 'У Вас нет на это прав'});
    }
    await findFriend.remove();

    res.send(findFriend)
  }catch(e){
    next(e);
  }
});

module.exports = router;
