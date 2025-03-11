const express = require('express');
const { Posts, getPost, getIdPost } = require('../controller/postController');

const postRouter = express.Router();
postRouter.post('/create-post', Posts);
postRouter.get('/create-post', getPost);
postRouter.get('/create-post/:id', getIdPost);

module.exports = postRouter;