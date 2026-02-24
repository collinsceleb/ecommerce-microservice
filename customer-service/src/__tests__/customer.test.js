/**
 * @module __tests__/customer.test
 * @description Integration tests for the Customer Service API endpoints.
 * Uses Supertest to make HTTP requests against the Express app.
 * MongoDB operations are mocked using Jest.
 */

const request = require("supertest");
const express = require("express");
const customerRoutes = require("../routes/customerRoutes");
const Customer = require("../models/Customer");

// Mock Mongoose model methods
jest.mock("../models/Customer");

/**
 * Create a lightweight Express app for testing (no DB connection needed).
 */
const app = express();
app.use(express.json());
app.use("/api/customers", customerRoutes);

describe("Customer Service API", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/customers", () => {
        it("should return all customers with a 200 status", async () => {
            const mockCustomers = [
                { _id: "abc123", name: "John Doe", email: "john.doe@example.com" },
                { _id: "def456", name: "Jane Smith", email: "jane.smith@example.com" },
            ];

            Customer.find.mockResolvedValue(mockCustomers);

            const res = await request(app).get("/api/customers");

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.count).toBe(2);
            expect(res.body.data).toEqual(mockCustomers);
            expect(Customer.find).toHaveBeenCalledTimes(1);
        });

        it("should return 500 if a database error occurs", async () => {
            Customer.find.mockRejectedValue(new Error("DB connection failed"));

            const res = await request(app).get("/api/customers");

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe("DB connection failed");
        });
    });

    describe("GET /api/customers/:id", () => {
        it("should return a single customer by ID", async () => {
            const mockCustomer = {
                _id: "abc123",
                name: "John Doe",
                email: "john.doe@example.com",
            };

            Customer.findById.mockResolvedValue(mockCustomer);

            const res = await request(app).get("/api/customers/abc123");

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockCustomer);
            expect(Customer.findById).toHaveBeenCalledWith("abc123");
        });

        it("should return 404 if the customer is not found", async () => {
            Customer.findById.mockResolvedValue(null);

            const res = await request(app).get("/api/customers/nonexistent");

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe("Customer not found");
        });

        it("should return 500 if a database error occurs", async () => {
            Customer.findById.mockRejectedValue(new Error("DB error"));

            const res = await request(app).get("/api/customers/abc123");

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe("DB error");
        });
    });
});
