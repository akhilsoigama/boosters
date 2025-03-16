const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'b51f875acb0d1098039b355d07063203175d1da813df2e8bde478c1f842e06e7';

const authMiddleware = (req, res, next) => {
  // Log incoming cookies for debugging
  console.log('Cookies:', req.cookies);

  // Extract the token from cookies
  const token = req.cookies.token;
  if (!token) {
    console.log('No token provided'); // Debugging log
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  console.log('Token:', token); // Debugging log

  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey);
    console.log('Decoded token:', decoded); // Debugging log

    // Attach the user ID to the request object
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message); // Debugging log

    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorized: Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    } else {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = authMiddleware;