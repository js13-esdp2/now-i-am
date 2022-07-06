const express = require('express');
const mongoose = require('mongoose');
const Friends = require("../models/Friends");
const auth = require('../middleware/auth');
const websocket = require('../classes/websocket');

const router = express.Router();

let notifications = {}

websocket.onEvent('new_connection', (ws) => {
  if (notifications[ws.userId]){
    const wsAddFriendObj = {
      type: 'ADD_FRIEND',
      notifications: notifications[ws.userId]
    }
    ws.send(JSON.stringify(wsAddFriendObj));
    delete notifications[ws.userId];
  }
})

router.get('/', auth, async (req, res, next) => {
  try {
    const friends = await Friends.find({friend: req.user._id}).populate('user', 'displayName photo');
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

    const userWs = websocket.getActiveConnections[req.body.userId];
    if (userWs) {
      const wsAddFriendObj = {
        type: 'ADD_FRIEND',
        notifications: 1
      }
      userWs.send(JSON.stringify(wsAddFriendObj));
    } else {
      if (notifications[req.body.userId]){
        notifications[req.body.userId]++;
      } else {
        notifications[req.body.userId] = 1;
      }
    }

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
    // const findFriend = await Friends.deleteOne({user: {_id: req.params.id}}, {friend: {_id: req.user._id}});
    const findFriend = await Friends.deleteOne({_id: req.params.id}, {friend: req.user._id});
    return res.send(findFriend)
  }catch(e){
    next(e);
  }
});

router.put('/:id',  async(req, res, next) =>{
  try{
    const findFriend = await Friends.updateOne({_id: req.params.id}, {isFriend: true});
    res.send(findFriend)
  }catch(e){
    next(e);
  }
});

module.exports = router;
