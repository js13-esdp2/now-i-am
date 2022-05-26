const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const dateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timezone: 'GMT+6',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
};

const MessageSchema = new Schema({
  chatRoomInbox: {
    type: String,
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
  isRead: {
    type: Boolean,
    default: false,
    required: true,
  }
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
