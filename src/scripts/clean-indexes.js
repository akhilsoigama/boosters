const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://akhilsoigama:akhil123@cluster0.3ajd1.mongodb.net/booster?retryWrites=true&w=majority&appName=Cluster0';

async function cleanIndexes() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const indexes = await mongoose.connection.db
      .collection('profiles')
      .getIndexes();
    console.log('Current indexes:', indexes);

    if (indexes.some((index) => index.name === 'email_1')) {
      await mongoose.connection.db.collection('profiles').dropIndex('email_1');
      console.log('Dropped email_1 index');
    } else {
      console.log('No email_1 index found');
    }

    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error cleaning indexes:', error);
    process.exit(1);
  }
}

cleanIndexes();