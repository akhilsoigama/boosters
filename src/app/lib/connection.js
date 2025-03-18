const mongoose = require('mongoose');

const mongoUsername = process.env.MONGO_USERNAME || 'akhilsoigama';
const mongoPassword = process.env.MONGO_PASSWORD || 'akhil123';
const ConnectionStr = `mongodb+srv://${mongoUsername}:${mongoPassword}@cluster0.3ajd1.mongodb.net/booster?retryWrites=true&w=majority&appName=Cluster0`;

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }

  try {
    await mongoose.connect(ConnectionStr, {
      dbName: 'booster',
    });
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw new Error('MongoDB connection failed');
  }
};

module.exports = connectDB;
