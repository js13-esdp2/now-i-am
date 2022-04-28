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
  time: {
    type: TimesSchema,
  },
  likes: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }]
})

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;