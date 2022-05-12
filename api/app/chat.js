const express = require('express');
const User = require('../models/User');
const ChatRoom = require('../models/ChatRoom');

const router = express.Router();


router.get('/:chatRoomInbox', async (req, res, next) => {
  try {
    const chatRoom = await ChatRoom.find({chatRoomInbox: req.params.chatRoomInbox})
    return res.send(chatRoom);
  } catch (e) {
    return next(e);
  }
});

router.get('/', async (req, res, next) => {
  try {
    if (req.query.ownerId) {
      const chatRooms = await ChatRoom.find({owner: req.query.ownerId})
        .populate('owner', 'displayName photo')
        .populate('chattingWith', 'displayName photo')
        .populate({path: 'messages', options: {sort: {_id: -1}}});
      return res.send(chatRooms);
    }
    const chatRooms = await ChatRoom.find();
    return res.send(chatRooms);
  } catch (e) {
    return next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const participants = req.body.participants;
    const firstUserId = participants[0];
    const secondUserId = participants[1];

    if (firstUserId === secondUserId) {
      return res.send({message: 'id\'s of users are duplicated'});
    }

    const chatRoomInboxes = [firstUserId + secondUserId, secondUserId + firstUserId];
    const firstUser = await User.findById(participants[0]);
    const secondUser = await User.findById(participants[1]);
    const chatRooms = [];
    let chatRoomExists = false;

    for (let i = 0; i < chatRoomInboxes.length; i++) {
      const chatRoom = await ChatRoom.findOne({chatRoomInbox: chatRoomInboxes[i]});
      if (chatRoom) {
        chatRooms.push(chatRoom);
      }
    }

    if (chatRooms.length !== 0) {
      chatRoomExists = true;
    }

    if (!chatRoomExists) {

      const firstChatRoomData = {
        owner: firstUser._id,
        name: secondUser.displayName,
        lastMessage: '',
        messages: [],
        chattingWith: secondUser._id,
        chatRoomInbox: firstUserId + secondUserId,
      }

      const secondChatRoomData = {
        owner: secondUser._id,
        name: firstUser.displayName,
        lastMessage: '',
        messages: [],
        chattingWith: firstUser._id,
        chatRoomInbox: firstUserId + secondUserId,
      }

      await ChatRoom.create(firstChatRoomData);
      await ChatRoom.create(secondChatRoomData);
      return res.send({message: 'created new chat rooms'});
    }
    return res.send({message: 'such chat room already exists'})
  } catch (e) {
    return next(e);
  }
});

router.delete('/oneChatRoom', async (req, res, next) => {
  try {
    if (!req.body.chatRoomInbox || !req.body.ownerId) {
      return res.status(404).send({message: 'Wrong data!'});
    }
    const chatRoomInbox = req.body.chatRoomInbox;
    const owner = req.body.ownerId;
    const chatRoom = await ChatRoom.findOneAndDelete({chatRoomInbox, owner});
    return res.send({message: 'chatRoom deleted with id = ', chatRoom});
  } catch (e) {
    next(e);
  }
});

router.delete('/chatRooms', async (req, res, next) => {
  try {
    if (!req.body.chatRoomInbox) {
      return res.status(404).send({message: 'Wrong data!'});
    }
    const chatRoomInbox = req.body.chatRoomInbox;
    const chatRooms = await ChatRoom.deleteMany({chatRoomInbox});
    return res.send({message: 'chatRoom deleted with id = ', chatRooms});
  } catch (e) {
    next(e);
  }
});

router.delete('/chatRoom/messages', async (req, res, next) => {
  try {
    if (!req.body.chatRoomInbox || !req.body.ownerId) {
      return res.status(404).send({message: 'Wrong data!'});
    }
    const owner = req.body.ownerId;
    const chatRoomInbox = req.body.chatRoomInbox;
    const chatRoom = await ChatRoom.findOneAndUpdate({chatRoomInbox, owner}, {messages: []});
    return res.send(chatRoom);
  } catch (e) {
    next(e);
  }
});

router.delete('/chatRooms/allMessages', async (req, res, next) => {
  try {
    if (!req.body.chatRoomInbox) {
      return res.status(404).send({message: 'Wrong data!'});
    }
    const chatRoomInbox = req.body.chatRoomInbox;
    const chatRoom = await ChatRoom.updateMany({chatRoomInbox}, {messages: []});
    return res.send(chatRoom);
  } catch (e) {
    next(e);
  }
});


module.exports = router;
