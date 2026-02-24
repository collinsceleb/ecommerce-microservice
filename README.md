# E-Commerce Microservices

A microservices-based e-commerce backend built with **Node.js**, **Express.js**, **MongoDB**, **RabbitMQ**, and **Docker**.

## Architecture

| Service | Port | Description |
|---|---|---|
| Customer Service | 3001 | Manages customers (seeded) |
| Product Service | 3002 | Manages products (seeded) |
| Order Service | 3003 | Creates orders, calls Payment Service |
| Payment Service | 3004 | Mock payments, publishes to RabbitMQ |
| Worker | — | Consumes RabbitMQ queue, saves transaction history |

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [pnpm](https://pnpm.io/installation) (for local development)

## Quick Start (Docker)

```bash
# Build and start all services
docker-compose up --build -d

# Verify containers
docker-compose ps

# Tail logs
docker-compose logs -f
```

## API Endpoints

### Customers
- `GET  http://localhost:3001/api/customers` — List all customers
- `GET  http://localhost:3001/api/customers/:id` — Get customer by ID

### Products
- `GET  http://localhost:3002/api/products` — List all products
- `GET  http://localhost:3002/api/products/:id` — Get product by ID

### Orders
- `POST http://localhost:3003/api/orders` — Create an order
- `GET  http://localhost:3003/api/orders` — List all orders
- `GET  http://localhost:3003/api/orders/:id` — Get order by ID

**Create Order body:**
```json
{
  "customerId": "<customer_id>",
  "productId": "<product_id>",
  "amount": 79.99
}
```

### Payments
- `POST http://localhost:3004/api/payments` — Process payment (used internally by Order Service)

## Local Development

```bash
# Install dependencies for a service
cd customer-service && pnpm install

# Run in dev mode
pnpm dev

# Run tests
pnpm test
```

## Tear Down

```bash
docker-compose down -v
```
