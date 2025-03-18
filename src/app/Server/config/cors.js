const cors = require('cors');

const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = isProduction
  ? ['https://boosters-sooty.vercel.app']
  : ['http://localhost:3000', 'http://localhost:5000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposedHeaders: ['set-cookie'],
};

module.exports = cors(corsOptions);
