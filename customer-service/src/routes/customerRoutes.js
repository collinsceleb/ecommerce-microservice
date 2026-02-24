/**
 * @module routes/customerRoutes
 * @description Express routes for the Customer resource.
 */

const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

/**
 * GET /api/customers
 * @description Retrieve all customers.
 * @returns {Array<Customer>} List of all customers.
 */
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json({
            success: true,
            count: customers.length,
            data: customers,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/customers/:id
 * @description Retrieve a single customer by ID.
 * @param {string} req.params.id - The MongoDB ObjectId of the customer.
 * @returns {Customer} The requested customer.
 */
router.get("/:id", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, error: "Customer not found" });
        }
        res.status(200).json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
