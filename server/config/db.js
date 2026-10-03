const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (!uri) {
      console.log('⚡ MONGODB_URI not set. Initializing in-memory MongoDB for local development...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      console.log('✅ In-memory MongoDB instance active at:', uri);
    }

    const conn = await mongoose.connect(uri);
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
