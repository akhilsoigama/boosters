const jwt = require('jsonwebtoken');
const User = require('../../model/users');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET || 'b51f875acb0d1098039b355d07063203175d1da813df2e8bde478c1f842e06e7';

const checkAuth = (req, res) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, secretKey);
      res.json({ isLoggedIn: true });
    } catch (error) {
      res.json({ isLoggedIn: false });
    }
  } else {
    res.json({ isLoggedIn: false });
  }
};

const getUser = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const getUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
};

module.exports = { checkAuth, getUser, getUserId };