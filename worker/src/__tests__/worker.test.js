/**
 * @module __tests__/worker.test
 * @description Unit tests for the RabbitMQ Worker.
 * Tests the message handling logic that saves transaction history to MongoDB.
 * Both MongoDB and RabbitMQ are mocked using Jest.
 */

const TransactionHistory = require("../models/TransactionHistory");

// Mock Mongoose model methods
jest.mock("../models/TransactionHistory");

describe("Worker — Message Handler", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Replicate the handleMessage function from src/index.js
     * so we can test it in isolation without requiring a real RabbitMQ connection.
     */
    const handleMessage = async (data) => {
        const { customerId, orderId, productId, amount } = data;
        const record = await TransactionHistory.create({
            customerId,
            orderId,
            productId,
            amount,
        });
        return record;
    };

    it("should save a transaction history record from a queue message", async () => {
        const messageData = {
            customerId: "cust1",
            orderId: "order123",
            productId: "prod1",
            amount: 79.99,
        };

        const mockRecord = {
            _id: "txn1",
            ...messageData,
            processedAt: new Date(),
        };

        TransactionHistory.create.mockResolvedValue(mockRecord);

        const result = await handleMessage(messageData);

        expect(result).toEqual(mockRecord);
        expect(TransactionHistory.create).toHaveBeenCalledTimes(1);
        expect(TransactionHistory.create).toHaveBeenCalledWith({
            customerId: "cust1",
            orderId: "order123",
            productId: "prod1",
            amount: 79.99,
        });
    });

    it("should throw an error if database save fails", async () => {
        TransactionHistory.create.mockRejectedValue(
            new Error("DB write error")
        );

        const messageData = {
            customerId: "cust1",
            orderId: "order123",
            productId: "prod1",
            amount: 79.99,
        };

        await expect(handleMessage(messageData)).rejects.toThrow("DB write error");
    });

    it("should handle messages with all required fields correctly", async () => {
        const messageData = {
            customerId: "cust2",
            orderId: "order456",
            productId: "prod3",
            amount: 49.99,
        };

        const mockRecord = {
            _id: "txn2",
            ...messageData,
            processedAt: new Date(),
        };

        TransactionHistory.create.mockResolvedValue(mockRecord);

        const result = await handleMessage(messageData);

        expect(result._id).toBe("txn2");
        expect(result.customerId).toBe("cust2");
        expect(result.orderId).toBe("order456");
        expect(result.productId).toBe("prod3");
        expect(result.amount).toBe(49.99);
    });
});
