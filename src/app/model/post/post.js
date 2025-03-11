const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  auther: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  User_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
  }
});

const Post = mongoose.models.posts || mongoose.model('posts', userSchema);

module.exports = Post;