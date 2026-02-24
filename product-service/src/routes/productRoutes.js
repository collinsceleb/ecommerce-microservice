/**
 * @module routes/productRoutes
 * @description Express routes for the Product resource.
 */

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

/**
 * GET /api/products
 * @description Retrieve all products.
 * @returns {Array<Product>} List of all products.
 */
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/products/:id
 * @description Retrieve a single product by ID.
 * @param {string} req.params.id - The MongoDB ObjectId of the product.
 * @returns {Product} The requested product.
 */
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
