const express = require('express');
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
const router = express.Router();
require('express-ws')(router);


const activeConnections = {}

router.ws('/', (ws, req) => {
  let userId;

  ws.on('message', async (msg) => {
    const decodedMessage = JSON.parse(msg);

    switch (decodedMessage.type) {
      case 'LOGIN':
        userId = decodedMessage.userId;
        activeConnections[userId] = ws;
        break;
      case 'NEW_MESSAGE':
        const newMessage = await Message.create(decodedMessage.messageData);

        await ChatRoom.updateMany(
          {chatRoomInbox: decodedMessage.messageData.chatRoomInbox},
          {
            $set: {lastMessage: newMessage.text},
            $push: {messages: newMessage}
          });

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

        break;
    }

    ws.on('close', () => {
      delete activeConnections[userId];
    })
  })
});


module.exports = router;
