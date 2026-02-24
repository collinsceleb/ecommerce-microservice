/**
 * @module models/Product
 * @description Mongoose schema and model for the Product entity.
 */

const mongoose = require("mongoose");

/**
 * Product Schema
 * @typedef {Object} Product
 * @property {string} name - Product name (required).
 * @property {string} description - Product description.
 * @property {number} price - Product price in USD (required).
 * @property {number} stock - Available stock count (defaults to 100).
 * @property {Date} createdAt - Timestamp of record creation.
 */
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Price cannot be negative"],
    },
    stock: {
        type: Number,
        default: 100,
        min: [0, "Stock cannot be negative"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Product", productSchema);
