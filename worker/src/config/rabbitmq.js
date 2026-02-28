const amqplib = require("amqplib");

const QUEUE_NAME = "payment_queue";

const consumeFromQueue = async (onMessage) => {
    try {
        const connection = await amqplib.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        console.log(`[Worker] Listening on queue "${QUEUE_NAME}"...`);

        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                try {
                    const data = JSON.parse(msg.content.toString());
                    await onMessage(data);
                    channel.ack(msg);
                    console.log("[Worker] Message acknowledged");
                } catch (err) {
                    console.error("[Worker] Error processing message:", err.message);
                    channel.nack(msg, false, true);
                }
            }
        });
    } catch (error) {
        console.error(`[Worker] RabbitMQ connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { consumeFromQueue, QUEUE_NAME };
