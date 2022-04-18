const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  image: {
    type: String,
    required: true,
  },
  datetime: {
    type: String,
    required: true,
  },
  time: {
    type: String,
  }
})

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;