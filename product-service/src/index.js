const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const seedProducts = require("./seed/seed");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "product-service" });
});

const startServer = async () => {
    await connectDB();
    await seedProducts();

    app.listen(PORT, () => {
        console.log(`[Product Service] Server running on port ${PORT}`);
    });
};

startServer();

module.exports = app;
