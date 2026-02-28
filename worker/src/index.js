const connectDB = require("./config/db");
const { consumeFromQueue } = require("./config/rabbitmq");
const TransactionHistory = require("./models/TransactionHistory");

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
const start = async () => {
    await connectDB();
    await consumeFromQueue(handleMessage);
    console.log("[Worker] Ready and listening for messages");
};

start();
