const request = require("supertest");
const express = require("express");
const axios = require("axios");
const orderRoutes = require("../routes/orderRoutes");
const Order = require("../models/Order");

jest.mock("../models/Order");
jest.mock("axios");

const app = express();
app.use(express.json());
app.use("/api/orders", orderRoutes);

describe("Order Service API", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/orders", () => {
        it("should create an order and return the order summary", async () => {
            const mockOrder = {
                _id: "order123",
                customerId: "cust1",
                productId: "prod1",
                amount: 79.99,
                orderStatus: "pending",
            };

            Order.create.mockResolvedValue(mockOrder);

            axios.post.mockResolvedValue({
                data: { success: true, message: "Payment processed", orderId: "order123" },
            });

            const res = await request(app)
                .post("/api/orders")
                .send({
                    customerId: "cust1",
                    productId: "prod1",
                    amount: 79.99,
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual({
                customerId: "cust1",
                orderId: "order123",
                productId: "prod1",
                orderStatus: "pending",
            });

            expect(Order.create).toHaveBeenCalledWith({
                customerId: "cust1",
                productId: "prod1",
                amount: 79.99,
                orderStatus: "pending",
            });

            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining("/api/payments"),
                {
                    customerId: "cust1",
                    orderId: "order123",
                    productId: "prod1",
                    amount: 79.99,
                }
            );
        });

        it("should still create the order even if Payment Service fails", async () => {
            const mockOrder = {
                _id: "order456",
                customerId: "cust1",
                productId: "prod2",
                amount: 129.99,
                orderStatus: "pending",
            };

            Order.create.mockResolvedValue(mockOrder);

            axios.post.mockRejectedValue(new Error("Payment service unavailable"));

            const res = await request(app)
                .post("/api/orders")
                .send({
                    customerId: "cust1",
                    productId: "prod2",
                    amount: 129.99,
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.orderStatus).toBe("pending");
        });

        it("should return 400 if required fields are missing", async () => {
            const res = await request(app)
                .post("/api/orders")
                .send({ customerId: "cust1" }); // Missing productId and amount

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toContain("required");
        });

        it("should return 500 if database save fails", async () => {
            Order.create.mockRejectedValue(new Error("DB write error"));

            const res = await request(app)
                .post("/api/orders")
                .send({
                    customerId: "cust1",
                    productId: "prod1",
                    amount: 79.99,
                });

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe("DB write error");
        });
    });

    describe("GET /api/orders", () => {
        it("should return all orders", async () => {
            const mockOrders = [
                {
                    _id: "order1",
                    customerId: "cust1",
                    productId: "prod1",
                    amount: 79.99,
                    orderStatus: "pending",
                },
            ];

            Order.find.mockResolvedValue(mockOrders);

            const res = await request(app).get("/api/orders");

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.count).toBe(1);
            expect(res.body.data).toEqual(mockOrders);
        });
    });

    describe("GET /api/orders/:id", () => {
        it("should return a single order by ID", async () => {
            const mockOrder = {
                _id: "order1",
                customerId: "cust1",
                productId: "prod1",
                amount: 79.99,
                orderStatus: "pending",
            };

            Order.findById.mockResolvedValue(mockOrder);

            const res = await request(app).get("/api/orders/order1");

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockOrder);
        });

        it("should return 404 if the order is not found", async () => {
            Order.findById.mockResolvedValue(null);

            const res = await request(app).get("/api/orders/nonexistent");

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe("Order not found");
        });
    });
});
