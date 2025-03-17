const jwt = require('jsonwebtoken');
const User = require('../../model/users');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
    throw new Error("JWT_SECRET is not set in environment variables.");
}

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

const getUserId = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user', details: error.message });
    }
};

module.exports = {  getUser, getUserId, getAllUsers };
