/**
 * @module config/db
 * @description Establishes connection to MongoDB using Mongoose.
 */

const mongoose = require("mongoose");

/**
 * Connects to the MongoDB database.
 * Uses the MONGO_URI environment variable for the connection string.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[Customer Service] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Customer Service] MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
