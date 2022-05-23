const express = require('express');
const ws = require('express-ws');
const router = express.Router();
ws(express);

const eventCallbacks = {};
const activeConnections = {}

router.ws('/', (ws) => {
  ws.on('message', (message) => {
    try {
      const decodedMessage = JSON.parse(message);
      const messageType = decodedMessage.type;

      const getCallbacks = eventCallbacks[messageType];
      if (!getCallbacks) {
        return;
      }

      getCallbacks.forEach((callback) => {
        callback(ws, decodedMessage);
      });
    } catch (e) {
      console.log('Unknown message error', message, e);
    }
  });

  ws.on('close', () => {
    const getCallbacks = eventCallbacks['close'];
    if (!getCallbacks) {
      return;
    }

    getCallbacks.forEach((callback) => {
      callback(ws, { type: 'close' });
    });
  });
});

const addEventListener = (type, callback) => {
  if (eventCallbacks[type]) {
    eventCallbacks[type].push(callback);
  } else {
    eventCallbacks[type] = [callback];
  }
};

addEventListener('AUTH', (ws, message) => {
  try {
    const userId = message.userId;
    activeConnections[userId] = ws;
  } catch (e) {}
});

addEventListener('close', (ws) => {
  try {
    Object.keys(activeConnections).forEach((userId) => {
      const userWs = activeConnections[userId];
      if (userWs === ws) {
        delete activeConnections[userId];
      }
    });
  } catch (e) {}
});

module.exports = router;
module.exports.on = addEventListener;
module.exports.getActiveConnections = activeConnections;
