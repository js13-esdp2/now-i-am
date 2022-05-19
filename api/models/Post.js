const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimesSchema = new Schema({
  hours: Number,
  minutes: Number
})

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
  },
  datetime: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: new Date().toString(),
    required: true,
  },
  isVisible: {
    type: Boolean,
    default: true,
    required: true,
  },
  invisibleAtUnixTime: {
    type: Number,
    required: true,
  },
  invisibleDate: {
    type: String,
    required: true,
  },
  time: {
    type: TimesSchema,
  },
  likes: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  geolocation: {
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  }
})

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
