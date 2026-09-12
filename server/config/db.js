const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/carbon_trace';
    // Set a lower selection timeout so it doesn't hang for 30s if DB is offline
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`MongoDB Connection Warning: ${error.message}`);
    console.warn(`Server will run in fallback mode if MongoDB is not running locally.`);
    return false;
  }
};

module.exports = connectDB;
