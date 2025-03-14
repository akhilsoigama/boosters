const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'b51f875acb0d1098039b355d07063203175d1da813df2e8bde478c1f842e06e7'

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  console.log('middelware',token)
  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;