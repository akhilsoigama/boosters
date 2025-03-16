const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('./config/cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('../lib/connection');
const postRouter = require('./routes/postRoute');
const middelwareRoutes = require('./routes/middelwareRoutes');
const profileRouter = require('./routes/profileRoute');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(bodyParser.json()); 
app.use(cookieParser()); 
app.use(cors);



app.use(middelwareRoutes); 
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