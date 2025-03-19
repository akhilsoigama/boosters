const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI;

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, { dbName: 'booster' });
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw new Error('MongoDB connection failed');
  }
};

module.exports = connectDB;
