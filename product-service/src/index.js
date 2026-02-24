/**
 * @module index
 * @description Entry point for the Product Service.
 * Connects to MongoDB, seeds the database, and starts the Express server.
 */

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const seedProducts = require("./seed/seed");

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

/**
 * Health check endpoint.
 * @route GET /health
 */
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "product-service" });
});

/**
 * Starts the server after connecting to MongoDB and seeding data.
 */
const startServer = async () => {
    await connectDB();
    await seedProducts();

    app.listen(PORT, () => {
        console.log(`[Product Service] Server running on port ${PORT}`);
    });
};

startServer();

module.exports = app; // Exported for testing
