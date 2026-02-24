/**
 * @module models/Order
 * @description Mongoose schema and model for the Order entity.
 */

const mongoose = require("mongoose");

/**
 * Order Schema
 * @typedef {Object} Order
 * @property {string} customerId - ID of the customer placing the order (required).
 * @property {string} productId - ID of the product being ordered (required).
 * @property {number} amount - Total amount for the order (required).
 * @property {string} orderStatus - Current status of the order (defaults to "pending").
 * @property {Date} createdAt - Timestamp of record creation.
 */
const orderSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: [true, "Customer ID is required"],
    },
    productId: {
        type: String,
        required: [true, "Product ID is required"],
    },
    amount: {
        type: Number,
        required: [true, "Order amount is required"],
        min: [0, "Amount cannot be negative"],
    },
    orderStatus: {
        type: String,
        default: "pending",
        enum: ["pending", "completed", "failed"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", orderSchema);
