const mongoose = require("mongoose");

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
