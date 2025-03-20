const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
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
    required: true,
  },
  User_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required:true  
  },
});

const Post = mongoose.models.Posts || mongoose.model('Posts', postSchema);
module.exports = Post;
