const express = require('express');
const websocket = require('../classes/websocket');
const User = require('../models/User');

const router = express.Router();
const onlineStreams = {};

websocket.on('LIVE_STREAM_CREATE', async (ws) => {
  try {
    if (!ws['userId']) {
      return;
    }

    const user = await User.findOne({ _id: ws['userId'], isOnLiveStream: false });
    if (!user) {
      return ws.send(JSON.stringify({ error: 'Не удалось создать трансляцию' }));
    }

    user.isOnLiveStream = true;
    await user.save();

    onlineStreams[user._id] = { author: ws, users: [] };
  } catch (e) {}
});

websocket.on('LIVE_STREAM_CLOSE', async (ws) => {
  try {
    if (!ws['userId']) {
      return;
    }

    const user = await User.findOne({ _id: ws['userId'], isOnLiveStream: true });
    if (!user) {
      return;
    }

    user.isOnLiveStream = false;
    await user.save();

    const stream = onlineStreams[user._id];
    if (!stream) {
      return;
    }

    stream.users.forEach((user) => {
      user.send(JSON.stringify({ type: 'LIVE_STREAM_CLOSE' }));
    });

    delete onlineStreams[user._id];
  } catch (e) {}
});

websocket.onEvent('close', async (ws) => {
  try {
    if (!ws['userId']) {
      return;
    }

    const user = await User.findOne({_id: ws['userId'], isOnLiveStream: true});
    if (!user) {
      return;
    }

    user.isOnLiveStream = false;
    await user.save();

    const stream = onlineStreams[user._id];
    if (!stream) {
      return;
    }

    stream.users.forEach((user) => {
      user.send(JSON.stringify({type: 'LIVE_STREAM_CLOSE'}));
    });

    delete onlineStreams[user._id];
  } catch (e) {}
});


websocket.on('LIVE_STREAM_CONNECT', async (ws, message) => {
  try {
    if (!ws['userId']) {
      return;
    }

    if (message['user'] !== ws['userId']) {
      return;
    }

    const checkUser = await User.findOne({ _id: message.id, isOnLiveStream: true });
    if (!checkUser) {
      return ws.send(JSON.stringify({ error: 'Пользователь на данный момент не в трансляции' }));
    }

    const stream = onlineStreams[message.id];
    if (!stream) {
      return ws.send(JSON.stringify({ error: 'Пользователь на данный момент не в трансляции' }));
    }

    stream['users'].push(ws);
    stream['author'].send(JSON.stringify(message));
  } catch(e) {}
});

websocket.on('LIVE_STREAM_OFFER', async (ws, message) => {
  try {
    if (!ws['userId']) {
      return;
    }

    const stream = onlineStreams[ws['userId']];
    if (!stream) {
      return;
    }

    const clientUser = stream.users.find((user) => user['userId'] === message.user);
    if (!clientUser) {
      return;
    }

    clientUser.send(JSON.stringify(message));
  } catch (e) {}
});

websocket.on('LIVE_STREAM_ANSWER', async (ws, message) => {
  try {
    if (!ws['userId']) {
      return;
    }

    const stream = onlineStreams[message.id];
    if (!stream) {
      return;
    }

    const clientUser = stream.users.find((user) => user['userId'] === message.user);
    if (!clientUser) {
      return;
    }

    stream['author'].send(JSON.stringify(message));
  } catch (e) {}
});

websocket.on('LIVE_STREAM_CANDIDATE', async (ws, message) => {
  try {
    if (!ws['userId']) {
      return ws.send(JSON.stringify({ error: 'Вы не авторизованы' }));
    }

    const stream = onlineStreams[message.id];
    if (!stream) {
      return ws.send(JSON.stringify({ error: 'Стрим не найден' }));
    }

    const clientUser = stream.users.find((user) => user['userId'] === message.user);
    if (!clientUser) {
      return ws.send(JSON.stringify({ error: 'Пользователь в данном стриме отсутствует' }));
    }

    const socket = stream.author === ws ? clientUser : ws;
    ws.send(JSON.stringify({ message: 'Получатель: ' + socket['userId'] }));

    socket.send(JSON.stringify(message));
  } catch (e) {}
});

websocket.on('LIVE_STREAM_DISCONNECT', async (ws, message) => {
  try {
    if (!ws['userId']) {
      return;
    }

    const stream = onlineStreams[message.id];
    if (!stream) {
      return;
    }

    const clientUser = stream.users.find((user) => user['userId'] === message.user);
    if (!clientUser) {
      return;
    }

    stream['author'].send(JSON.stringify(message));
  } catch (e) {}
});

module.exports = router;