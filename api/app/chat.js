const express = require('express');
const User = require('../models/User');
const ChatRoom = require('../models/ChatRoom');
const websocket = require('../classes/websocket');
const Message = require('../models/Message');

const router = express.Router();


router.get('/:chatRoomId', async (req, res, next) => {
  try {
    const chatRoomId = req.params.chatRoomId;
    const chatRoom = await ChatRoom.findById(chatRoomId)
      .populate('owner', 'displayName photo')
      .populate('chattingWith', 'displayName photo');
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
    const firstUser = await User.findById(firstUserId);
    const secondUser = await User.findById(secondUserId);
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
    if (!req.body.chatRoomInbox || !req.body.owner) {
      return res.status(404).send({message: 'Wrong data!'});
    }

    const chatRoomInbox = req.body.chatRoomInbox;
    const chatRoom = await ChatRoom.deleteMany({chatRoomInbox});
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
    if (!req.body.chatRoomInbox || !req.body.owner) {
      return res.status(404).send({message: 'Wrong data!'});
    }
    const owner = req.body.owner;
    const chatRoomInbox = req.body.chatRoomInbox;
    const chatRoom = await ChatRoom.findOneAndUpdate({chatRoomInbox, owner}, {messages: [], lastMessage: ''});
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
    const chatRoom = await ChatRoom.updateMany({chatRoomInbox}, {messages: [], lastMessage: ''});
    return res.send(chatRoom);
  } catch (e) {
    next(e);
  }
});


websocket.on('NEW_MESSAGE', async (ws, decodedMessage) => {
  const activeConnections = websocket.getActiveConnections;
  const newMessage = await Message.create(decodedMessage.messageData);
  await ChatRoom.updateMany(
    {chatRoomInbox: decodedMessage.messageData.chatRoomInbox},
    {
      $set: {lastMessage: newMessage.text},
      $push: {messages: newMessage}
    });

  const filterParam = {
    owner: newMessage.userTo,
    chatRoomInbox: newMessage.chatRoomInbox,
  }

  const chattingWithChatRoom = await ChatRoom.findOneAndUpdate(
    filterParam,
    {$inc: {'newMessagesCounter': 1}},
  );

  const sendMessageData = {
    type: 'GET_MESSAGE',
    newMessage: newMessage,
  }

  const userTo = sendMessageData.newMessage.userTo.toString();
  const userFrom = sendMessageData.newMessage.userFrom.toString();

  if (activeConnections[userTo]) {
    const firstUser = activeConnections[userTo];
    firstUser.send(JSON.stringify(sendMessageData));
  }

  if (activeConnections[userFrom]) {
    const secondUser = activeConnections[userFrom];
    secondUser.send(JSON.stringify(sendMessageData));
  }
});


module.exports = router;
