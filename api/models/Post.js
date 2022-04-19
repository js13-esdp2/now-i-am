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
    required: true,
  },
  datetime: {
    type: String,
    required: true,
  },
  time: {
    type: TimesSchema,
  }
})

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;