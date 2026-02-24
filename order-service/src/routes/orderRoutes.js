/**
 * @module routes/orderRoutes
 * @description Express routes for the Order resource.
 * Handles order creation, which triggers a REST call to the Payment Service.
 */

const express = require("express");
const axios = require("axios");
const router = express.Router();
const Order = require("../models/Order");

const PAYMENT_SERVICE_URL =
    process.env.PAYMENT_SERVICE_URL || "http://payment-service:3004";

/**
 * POST /api/orders
 * @description Create a new order.
 *   1. Saves the order with status "pending".
 *   2. Sends a REST request to the Payment Service.
 *   3. Returns the order summary to the client.
 * @body {string} customerId - ID of the customer.
 * @body {string} productId  - ID of the product.
 * @body {number} amount     - Total order amount.
 * @returns {Object} { customerId, orderId, productId, orderStatus }
 */
router.post("/", async (req, res) => {
    try {
        const { customerId, productId, amount } = req.body;

        // Validate required fields
        if (!customerId || !productId || !amount) {
            return res.status(400).json({
                success: false,
                error: "customerId, productId, and amount are required",
            });
        }

        // 1. Save order in database with status "pending"
        const order = await Order.create({
            customerId,
            productId,
            amount,
            orderStatus: "pending",
        });

        // 2. Send payment request to Payment Service
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
            // Order is still saved as pending; payment can be retried
        }

        // 3. Respond to the client
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

/**
 * GET /api/orders
 * @description Retrieve all orders.
 * @returns {Array<Order>} List of all orders.
 */
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

/**
 * GET /api/orders/:id
 * @description Retrieve a single order by ID.
 * @param {string} req.params.id - The MongoDB ObjectId of the order.
 * @returns {Order} The requested order.
 */
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
