const express = require('express');
const { signup, login, logout } = require('../controller/authController');

const { getAllUsers, getUserId,  getUser } = require('../controller/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();



router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.get('/check-auth', authMiddleware, (req, res) => {
    res.json({ message: 'Authenticated', user: req.user });
});

module.exports = router;

router.get('/user', getUser)

router.get('/users', getAllUsers)
router.get('/users/:id', getUserId)
module.exports = router;