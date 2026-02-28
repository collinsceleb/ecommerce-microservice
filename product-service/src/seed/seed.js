const Product = require("../models/Product");
const seedProducts = async () => {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            const products = [
                {
                    name: "Wireless Headphones",
                    description: "Premium noise-cancelling wireless headphones",
                    price: 79.99,
                    stock: 50,
                },
                {
                    name: "Mechanical Keyboard",
                    description: "RGB backlit mechanical keyboard with Cherry MX switches",
                    price: 129.99,
                    stock: 30,
                },
                {
                    name: "USB-C Hub",
                    description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader",
                    price: 49.99,
                    stock: 100,
                },
            ];
            await Product.insertMany(products);
            console.log("[Product Service] Database seeded with 3 products");
        } else {
            console.log(`[Product Service] Database already has ${count} product(s), skipping seed`);
        }
    } catch (error) {
        console.error("[Product Service] Seed error:", error.message);
    }
};

module.exports = seedProducts;
