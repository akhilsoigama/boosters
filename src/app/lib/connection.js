const mongoose = require('mongoose');

const mongoUsername = process.env.MONGO_USERNAME || 'akhilsoigama';
const mongoPassword = process.env.MONGO_PASSWORD || 'akhil123';
const ConnectionStr = `mongodb+srv://${mongoUsername}:${mongoPassword}@cluster0.3ajd1.mongodb.net/booster?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {

     await mongoose.connect(ConnectionStr);
}
module.exports = connectDB;