const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.use("/api/orders", orderRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "order-service" });
});

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`[Order Service] Server running on port ${PORT}`);
    });
};

startServer();

module.exports = app;
