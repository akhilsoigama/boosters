const express = require('express');
const { signup, login, logout, checkAuth, } = require('../controller/authController');
const { getAllUsers, getUserId, getUser } = require('../controller/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// ✅ Ensure checkAuth exists
if (!checkAuth) throw new Error("checkAuth is not defined");
router.get('/check-auth', checkAuth);

router.get('/user', getUser);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserId);

module.exports = router;
