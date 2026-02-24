/**
 * @module models/TransactionHistory
 * @description Mongoose schema and model for the TransactionHistory entity.
 * Populated by the RabbitMQ worker when consuming payment_queue messages.
 */

const mongoose = require("mongoose");

/**
 * TransactionHistory Schema
 * @typedef {Object} TransactionHistory
 * @property {string} customerId - ID of the customer (required).
 * @property {string} orderId - ID of the related order (required).
 * @property {string} productId - ID of the product (required).
 * @property {number} amount - Transaction amount (required).
 * @property {Date} processedAt - Timestamp when the worker processed the message.
 */
const transactionHistorySchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: [true, "Customer ID is required"],
    },
    orderId: {
        type: String,
        required: [true, "Order ID is required"],
    },
    productId: {
        type: String,
        required: [true, "Product ID is required"],
    },
    amount: {
        type: Number,
        required: [true, "Transaction amount is required"],
        min: [0, "Amount cannot be negative"],
    },
    processedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("TransactionHistory", transactionHistorySchema);
