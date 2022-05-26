const express = require('express');
const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');

const router = express.Router();


router.get('/:chatRoomInbox', async (req, res, next) => {
  try {
      const messages = await Message.find({chatRoomInbox: req.params.chatRoomInbox})
      return res.send(messages);
  } catch (e) {
    return next(e);
  }
});

router.put('/isRead/:messageId', async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.messageId);
    const chatRooms = await ChatRoom.find({chatRoomInbox: message.chatRoomInbox});

    return res.send(message);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
