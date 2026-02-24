/**
 * @module index
 * @description Entry point for the RabbitMQ Worker.
 * Connects to MongoDB and starts consuming messages from the payment_queue.
 * Each consumed message is saved as a TransactionHistory record.
 */

const connectDB = require("./config/db");
const { consumeFromQueue } = require("./config/rabbitmq");
const TransactionHistory = require("./models/TransactionHistory");

/**
 * Handles an incoming message from the payment queue.
 * @param {Object} data - Parsed message data.
 * @param {string} data.customerId - Customer ID.
 * @param {string} data.orderId    - Order ID.
 * @param {string} data.productId  - Product ID.
 * @param {number} data.amount     - Transaction amount.
 */
const handleMessage = async (data) => {
    const { customerId, orderId, productId, amount } = data;

    const record = await TransactionHistory.create({
        customerId,
        orderId,
        productId,
        amount,
    });

    console.log("[Worker] Transaction history saved:", record._id.toString());
};

/**
 * Starts the worker by connecting to MongoDB and then consuming from the queue.
 */
const start = async () => {
    await connectDB();
    await consumeFromQueue(handleMessage);
    console.log("[Worker] Ready and listening for messages");
};

start();
