/**
 * @module config/db
 * @description Establishes connection to MongoDB using Mongoose.
 */

const mongoose = require("mongoose");

/**
 * Connects to the MongoDB database.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`[Product Service] MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[Product Service] MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
