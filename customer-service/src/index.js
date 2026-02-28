const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const customerRoutes = require("./routes/customerRoutes");
const seedCustomers = require("./seed/seed");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/customers", customerRoutes);

/**
 * Health check endpoint.
 * @route GET /health
 */
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "customer-service" });
});


const startServer = async () => {
    await connectDB();
    await seedCustomers();

    app.listen(PORT, () => {
        console.log(`[Customer Service] Server running on port ${PORT}`);
    });
};

startServer();

module.exports = app;
