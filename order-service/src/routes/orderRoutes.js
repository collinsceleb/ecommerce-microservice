const express = require("express");
const axios = require("axios");
const router = express.Router();
const Order = require("../models/Order");

const PAYMENT_SERVICE_URL =
    process.env.PAYMENT_SERVICE_URL || "http://payment-service:3004";

router.post("/", async (req, res) => {
    try {
        const { customerId, productId, amount } = req.body;

        if (!customerId || !productId || !amount) {
            return res.status(400).json({
                success: false,
                error: "customerId, productId, and amount are required",
            });
        }

        const order = await Order.create({
            customerId,
            productId,
            amount,
            orderStatus: "pending",
        });

        try {
            await axios.post(`${PAYMENT_SERVICE_URL}/api/payments`, {
                customerId,
                orderId: order._id.toString(),
                productId,
                amount,
            });
        } catch (paymentError) {
            console.error(
                "[Order Service] Payment service error:",
                paymentError.message
            );
        }

        res.status(201).json({
            success: true,
            data: {
                customerId: order.customerId,
                orderId: order._id,
                productId: order.productId,
                orderStatus: order.orderStatus,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, error: "Order not found" });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
