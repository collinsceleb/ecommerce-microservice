
const amqplib = require("amqplib");

let channel = null;

const QUEUE_NAME = "payment_queue";

const connectRabbitMQ = async () => {
    try {
        const connection = await amqplib.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log(`[Payment Service] RabbitMQ connected, queue "${QUEUE_NAME}" asserted`);
    } catch (error) {
        console.error(`[Payment Service] RabbitMQ connection error: ${error.message}`);
        process.exit(1);
    }
};

const publishToQueue = (data) => {
    if (!channel) {
        throw new Error("RabbitMQ channel not initialised");
    }
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(data)), {
        persistent: true,
    });
    console.log(`[Payment Service] Message published to "${QUEUE_NAME}":`, data);
};

module.exports = { connectRabbitMQ, publishToQueue, QUEUE_NAME };
