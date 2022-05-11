const mongoose = require('mongoose');
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


const MessageSchema = new mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  userFrom: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: String,
    default: new Date().toLocaleString("ru", dateOptions),
    required: true,
  },
  chatRoomInbox: {
    type: String,
    required: true,
  }
});


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
  messages: [MessageSchema],
});

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
module.exports = ChatRoom;
