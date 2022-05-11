const express = require('express');
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
const Post = require('../models/Post');
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


const checkIfPostsAreOnline = () => {
  setInterval(async () => {
    let currentUnixTime = Math.round((new Date().getTime() / 1000));

    const posts = await Post.find();
    const postsData = [...posts];

    for (let i = 0; i < postsData.length; i++) {
      const post = postsData[i];
      if (currentUnixTime > post.invisibleAtUnixTime) {
        await Post.findByIdAndUpdate(post._id, {isVisible: false});
      }
    }
  }, 60000);
}

checkIfPostsAreOnline();


module.exports = router;
