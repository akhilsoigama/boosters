const User = require('../../model/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

exports.signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser);
    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction, 
      sameSite: isProduction ? 'None' : 'Lax',
      path: '/',
  };
  
  if (isProduction) {
      cookieOptions.domain = '.boosters-sooty.vercel.app'; 
  }
  
  res.cookie('token', token, cookieOptions);
  

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken(user);
    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction, 
      sameSite: isProduction ? 'None' : 'Lax',
      path: '/',
  };
  
  if (isProduction) {
      cookieOptions.domain = '.boosters-sooty.vercel.app'; 
  }
  
  res.cookie('token', token, cookieOptions);
  
    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
exports.logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // ✅ Production me true rakho
    sameSite: isProduction ? 'None' : 'Lax',
    path: '/',
};

if (isProduction) {
    cookieOptions.domain = '.boosters-sooty.vercel.app'; // ✅ Vercel ke liye domain set karo
}

res.clearCookie('token', token, cookieOptions);


  res.json({ message: 'Logged out successfully' });
};
exports.checkAuth = async (req, res) => {
  try {
      console.log("Incoming Cookies:", req.cookies);
      const token = req.cookies.token; 
      
      if (!token) return res.json({ isLoggedIn: false });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.json({ isLoggedIn: true, user: { id: decoded.id, email: decoded.email } });
  } catch (error) {
      console.error("JWT Error:", error);
      res.json({ isLoggedIn: false });
  }
};