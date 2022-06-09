const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  posts: {
    type: Number,
    default: 0,
  }
});
CategorySchema.index({ title: 'text' });

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;