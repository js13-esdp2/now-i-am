const express = require('express');
const Message = require('../models/Message');

const router = express.Router();


router.get('/:chatRoomInbox', async (req, res, next) => {
  try {
      const messages = await Message.find({chatRoomInbox: req.params.chatRoomInbox})
      return res.send(messages);
  } catch (e) {
    return next(e);
  }
});


module.exports = router;
