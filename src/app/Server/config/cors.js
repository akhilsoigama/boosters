const cors = require('cors');

const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = isProduction
  ? ['https://boosters-sooty.vercel.app']
  : ['http://localhost:3000']; 

const corsOptions = {
  origin: allowedOrigins,
  credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposedHeaders: ['set-cookie'], 
};
module.exports=(cors(corsOptions));
