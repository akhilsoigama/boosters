const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const middelwareRoutes = express.Router();
middelwareRoutes.get('/protected', authMiddleware);
module.exports = middelwareRoutes;