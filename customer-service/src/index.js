/**
 * @module index
 * @description Entry point for the Customer Service.
 * Connects to MongoDB, seeds the database, and starts the Express server.
 */

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const customerRoutes = require("./routes/customerRoutes");
const seedCustomers = require("./seed/seed");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/customers", customerRoutes);

/**
 * Health check endpoint.
 * @route GET /health
 */
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "customer-service" });
});

/**
 * Starts the server after connecting to MongoDB and seeding data.
 */
const startServer = async () => {
    await connectDB();
    await seedCustomers();

    app.listen(PORT, () => {
        console.log(`[Customer Service] Server running on port ${PORT}`);
    });
};

startServer();

module.exports = app; // Exported for testing
