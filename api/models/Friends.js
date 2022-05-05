const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  friend: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
})

const Friends = mongoose.model('Friends', FriendsSchema);
module.exports = Friends;