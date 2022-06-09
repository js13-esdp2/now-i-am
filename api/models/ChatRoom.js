const mongoose = require('mongoose');
const MessageSchema = require('../models/Message').MessageSchema;
const Schema = mongoose.Schema;

const dateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timezone: 'GMT+6',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
};

const ChatRoomSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  chattingWith: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  chatRoomInbox: {
    type: String,
    required: true,
  },
  lastMessage: String,
  newMessagesCounter: {
    type: Number,
    default: 0,
    required: false,
  },
  messages: [MessageSchema],
});

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
module.exports = ChatRoom;
