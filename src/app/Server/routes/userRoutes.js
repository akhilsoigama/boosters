const express = require('express');
const { signup, login } = require('../controller/authController');

const { getUserId, getUser, checkAuth, getAllUsers } = require('../controller/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.get('/check-auth', checkAuth)
router.get('/user', getUser)
router.get('/users', getAllUsers)
router.get('/users/:id ', getUserId)

module.exports = router;