const request = require("supertest");
const express = require("express");
const productRoutes = require("../routes/productRoutes");
const Product = require("../models/Product");

jest.mock("../models/Product");

const app = express();
app.use(express.json());
app.use("/api/products", productRoutes);

describe("Product Service API", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/products", () => {
        it("should return all products with a 200 status", async () => {
            const mockProducts = [
                {
                    _id: "prod1",
                    name: "Wireless Headphones",
                    description: "Premium noise-cancelling wireless headphones",
                    price: 79.99,
                    stock: 50,
                },
                {
                    _id: "prod2",
                    name: "Mechanical Keyboard",
                    description: "RGB backlit mechanical keyboard",
                    price: 129.99,
                    stock: 30,
                },
                {
                    _id: "prod3",
                    name: "USB-C Hub",
                    description: "7-in-1 USB-C hub",
                    price: 49.99,
                    stock: 100,
                },
            ];

            Product.find.mockResolvedValue(mockProducts);

            const res = await request(app).get("/api/products");

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.count).toBe(3);
            expect(res.body.data).toEqual(mockProducts);
            expect(Product.find).toHaveBeenCalledTimes(1);
        });

        it("should return 500 if a database error occurs", async () => {
            Product.find.mockRejectedValue(new Error("DB connection failed"));

            const res = await request(app).get("/api/products");

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe("DB connection failed");
        });
    });

    describe("GET /api/products/:id", () => {
        it("should return a single product by ID", async () => {
            const mockProduct = {
                _id: "prod1",
                name: "Wireless Headphones",
                price: 79.99,
                stock: 50,
            };

            Product.findById.mockResolvedValue(mockProduct);

            const res = await request(app).get("/api/products/prod1");

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockProduct);
            expect(Product.findById).toHaveBeenCalledWith("prod1");
        });

        it("should return 404 if the product is not found", async () => {
            Product.findById.mockResolvedValue(null);

            const res = await request(app).get("/api/products/nonexistent");

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe("Product not found");
        });

        it("should return 500 if a database error occurs", async () => {
            Product.findById.mockRejectedValue(new Error("DB error"));

            const res = await request(app).get("/api/products/prod1");

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe("DB error");
        });
    });
});
