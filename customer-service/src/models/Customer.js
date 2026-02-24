/**
 * @module models/Customer
 * @description Mongoose schema and model for the Customer entity.
 */

const mongoose = require("mongoose");

/**
 * Customer Schema
 * @typedef {Object} Customer
 * @property {string} name - Full name of the customer (required).
 * @property {string} email - Email address of the customer (required, unique).
 * @property {Date} createdAt - Timestamp of record creation.
 */
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Customer name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Customer email is required"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Customer", customerSchema);
