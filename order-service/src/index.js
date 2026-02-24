/**
 * @module index
 * @description Entry point for the Order Service.
 * Connects to MongoDB and starts the Express server.
 */

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/orders", orderRoutes);

/**
 * Health check endpoint.
 * @route GET /health
 */
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "order-service" });
});

/**
 * Starts the server after connecting to MongoDB.
 */
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`[Order Service] Server running on port ${PORT}`);
    });
};

startServer();

module.exports = app; // Exported for testing
