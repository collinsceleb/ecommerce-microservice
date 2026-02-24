/**
 * @module index
 * @description Entry point for the Payment Service.
 * Connects to MongoDB and RabbitMQ, then starts the Express server.
 */

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { connectRabbitMQ } = require("./config/rabbitmq");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/payments", paymentRoutes);

/**
 * Health check endpoint.
 * @route GET /health
 */
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "payment-service" });
});

/**
 * Starts the server after connecting to MongoDB and RabbitMQ.
 */
const startServer = async () => {
    await connectDB();
    await connectRabbitMQ();

    app.listen(PORT, () => {
        console.log(`[Payment Service] Server running on port ${PORT}`);
    });
};

startServer();

module.exports = app; // Exported for testing
