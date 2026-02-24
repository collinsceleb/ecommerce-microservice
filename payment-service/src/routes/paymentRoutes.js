/**
 * @module routes/paymentRoutes
 * @description Express routes for the Payment resource.
 * This is a demonstration-only payment service — no real payment processing.
 */

const express = require("express");
const router = express.Router();
const { publishToQueue } = require("../config/rabbitmq");

/**
 * POST /api/payments
 * @description Process a mock payment and publish transaction details to RabbitMQ.
 * @body {string} customerId - ID of the customer.
 * @body {string} orderId    - ID of the related order.
 * @body {string} productId  - ID of the product.
 * @body {number} amount     - Transaction amount.
 * @returns {Object} { success, message, orderId }
 */
router.post("/", async (req, res) => {
    try {
        const { customerId, orderId, productId, amount } = req.body;

        // Validate required fields
        if (!customerId || !orderId || !amount) {
            return res.status(400).json({
                success: false,
                error: "customerId, orderId, and amount are required",
            });
        }

        // Publish transaction details to RabbitMQ queue
        const transactionData = { customerId, orderId, productId, amount };
        publishToQueue(transactionData);

        res.status(200).json({
            success: true,
            message: "Payment processed",
            orderId,
        });
    } catch (error) {
        console.error("[Payment Service] Error processing payment:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
