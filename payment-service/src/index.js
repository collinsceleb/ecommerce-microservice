const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { connectRabbitMQ } = require("./config/rabbitmq");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

app.use("/api/payments", paymentRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "payment-service" });
});


const startServer = async () => {
    await connectDB();
    await connectRabbitMQ();

    app.listen(PORT, () => {
        console.log(`[Payment Service] Server running on port ${PORT}`);
    });
};

startServer();

module.exports = app; 
