/**
 * @module __tests__/payment.test
 * @description Integration tests for the Payment Service API endpoints.
 * Uses Supertest to make HTTP requests against the Express app.
 * RabbitMQ publishing is mocked using Jest.
 */

const request = require("supertest");
const express = require("express");
const paymentRoutes = require("../routes/paymentRoutes");
const { publishToQueue } = require("../config/rabbitmq");

// Mock the RabbitMQ publish helper
jest.mock("../config/rabbitmq", () => ({
    publishToQueue: jest.fn(),
}));

/**
 * Create a lightweight Express app for testing (no RabbitMQ connection needed).
 */
const app = express();
app.use(express.json());
app.use("/api/payments", paymentRoutes);

describe("Payment Service API", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/payments", () => {
        it("should process a payment and publish to RabbitMQ", async () => {
            const paymentData = {
                customerId: "cust1",
                orderId: "order123",
                productId: "prod1",
                amount: 79.99,
            };

            const res = await request(app)
                .post("/api/payments")
                .send(paymentData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Payment processed");
            expect(res.body.orderId).toBe("order123");

            // Verify publishToQueue was called with the correct data
            expect(publishToQueue).toHaveBeenCalledTimes(1);
            expect(publishToQueue).toHaveBeenCalledWith({
                customerId: "cust1",
                orderId: "order123",
                productId: "prod1",
                amount: 79.99,
            });
        });

        it("should return 400 if required fields are missing", async () => {
            const res = await request(app)
                .post("/api/payments")
                .send({ customerId: "cust1" }); // Missing orderId and amount

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toContain("required");
        });

        it("should return 500 if RabbitMQ publish fails", async () => {
            publishToQueue.mockImplementation(() => {
                throw new Error("RabbitMQ channel not initialised");
            });

            const res = await request(app)
                .post("/api/payments")
                .send({
                    customerId: "cust1",
                    orderId: "order123",
                    productId: "prod1",
                    amount: 79.99,
                });

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe("RabbitMQ channel not initialised");
        });
    });
});
