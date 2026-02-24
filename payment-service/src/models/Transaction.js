/**
 * @module models/Transaction
 * @description Mongoose schema and model for the Transaction entity.
 * Used by the Payment Service to record mock payment transactions.
 */

const mongoose = require("mongoose");

/**
 * Transaction Schema
 * @typedef {Object} Transaction
 * @property {string} customerId - ID of the customer (required).
 * @property {string} orderId - ID of the related order (required).
 * @property {string} productId - ID of the product (required).
 * @property {number} amount - Transaction amount (required).
 * @property {string} status - Transaction status (defaults to "completed").
 * @property {Date} createdAt - Timestamp of record creation.
 */
const transactionSchema = new mongoose.Schema({
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
    status: {
        type: String,
        default: "completed",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Transaction", transactionSchema);
