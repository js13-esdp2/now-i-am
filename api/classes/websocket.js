const express = require('express');
const ws = require('express-ws');
const router = express.Router();
ws(express);

const eventCallbacks = {};
const messageTypeCallbacks = {};
const activeConnections = {};

router.ws('/', (ws) => {
  ws.on('message', (message) => {
    try {
      const decodedMessage = JSON.parse(message);
      const messageType = decodedMessage.type;

      if (messageType === 'AUTH') {
        const userId = decodedMessage.userId;
        ws['userId'] = userId;

        activeConnections[userId] = ws;
        onEvent(ws, 'new_connection')
      }

      onMessageType(ws, messageType, decodedMessage);
    } catch (e) {
      console.log('Unknown message error', message, e);
    }
  });

  ws.on('close', () => {
    const userId = ws.userId;
    if (!activeConnections[userId]) {
      return;
    }

    delete activeConnections[userId];
    onEvent(ws, 'close');
  });
});

const onMessageType = (ws, type, message) => {
  const getCallbacks = messageTypeCallbacks[type];
  if (!getCallbacks) {
    return;
  }

  getCallbacks.forEach((callback) => {
    callback(ws, message);
  });
};

const onEvent = (ws, eventName) => {
  const getCallbacks = eventCallbacks[eventName];
  if (!getCallbacks) {
    return;
  }

  getCallbacks.forEach((callback) => {
    callback(ws);
  });
};

const addMessageTypeListener = (type, callback) => {
  if (messageTypeCallbacks[type]) {
    messageTypeCallbacks[type].push(callback);
  } else {
    messageTypeCallbacks[type] = [callback];
  }
};

const addEventListener = (type, callback) => {
  if (eventCallbacks[type]) {
    eventCallbacks[type].push(callback);
  } else {
    eventCallbacks[type] = [callback];
  }
};

module.exports = router;
module.exports.on = addMessageTypeListener;
module.exports.onEvent = addEventListener;
module.exports.getActiveConnections = activeConnections;
