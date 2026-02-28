const mongoose = require("mongoose");

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
