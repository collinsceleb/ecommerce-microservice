/**
 * @module seed/seed
 * @description Seeds the database with initial customer data if the collection is empty.
 */

const Customer = require("../models/Customer");

/**
 * Seed customers into the database.
 * Only inserts if no customers exist to avoid duplicates on restarts.
 */
const seedCustomers = async () => {
    try {
        const count = await Customer.countDocuments();
        if (count === 0) {
            const customers = [
                { name: "John Doe", email: "john.doe@example.com" },
                { name: "Jane Smith", email: "jane.smith@example.com" },
            ];
            await Customer.insertMany(customers);
            console.log("[Customer Service] Database seeded with 2 customers");
        } else {
            console.log(`[Customer Service] Database already has ${count} customer(s), skipping seed`);
        }
    } catch (error) {
        console.error("[Customer Service] Seed error:", error.message);
    }
};

module.exports = seedCustomers;
