const express = require('express');
const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User');

const router = express.Router();

router.get('/:chatRoomInbox', async (req, res, next) => {
  try {
    const messages = await Message.find({chatRoomInbox: req.params.chatRoomInbox})
    return res.send(messages);
  } catch (e) {
    return next(e);
  }
});

router.get('/all/new/:ownerId', async (req, res, next) => {
  try {
    const chatRooms = await ChatRoom.find({owner: req.params.ownerId});
    const user = await User.findById(req.params.ownerId);
    const chatRoomsData = [...chatRooms];
    let newMessagesCounter = 0;

    for (let i = 0; i < chatRoomsData.length; i++) {
      const chatRoom = chatRoomsData[i];
      const messages = chatRoom.messages;
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        if (!message.isRead && message.userFrom.toString() !== req.params.ownerId.toString()) {
          newMessagesCounter += 1;
        }
      }
    }

    const newMessagesData = {
      user: user,
      allNewMessages: newMessagesCounter,
    }

    return res.send(newMessagesData);
  } catch (e) {
    return next(e);
  }
});


router.put('/areRead', async (req, res, next) => {
  try {
    const messageData = req.body.messagesAreReadData;
    const filterParam = {
      chatRoomInbox: messageData.chatRoomInbox,
      owner: messageData.ownerId
    };

    const chattingWithChatRoom = await ChatRoom.findOne(filterParam);

    const myChatRoom = await ChatRoom.findOneAndUpdate(
      {owner: messageData.myId}, {$set: {newMessagesCounter: 0}}
    );

    const updatedMessages = [...chattingWithChatRoom.messages];
    updatedMessages.map((message) => {
      message.isRead = true;
      return message;
    });

    await ChatRoom.findOneAndUpdate(filterParam, {$set: {messages: updatedMessages}});
    return res.send(chattingWithChatRoom);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
