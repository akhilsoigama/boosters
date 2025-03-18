const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRouter = require('./routes/postRoute');
const profileRouter = require('./routes/profileRoute');
const connectDB = require('../lib/connection');
const cors = require('./config/cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json()); 
app.use(cookieParser()); 
app.use(cors);

app.use('/api', authRoutes);
app.use('/api', userRoutes); 
app.use('/api', postRouter); 
app.use('/api', profileRouter);

app.get('/', (req, res) => {
  res.send('<h1>This is the home page</h1>');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
