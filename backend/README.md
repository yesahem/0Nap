# Coldstart-Up Backend

A backend service to prevent serverless cold starts by periodically pinging user-submitted backend URLs. Built with Express, Prisma, Zod, and Postgres. Highly modular, secure, and production-ready.

---

## Tech Stack
- **Bun** (runtime & package manager)
- **Express** (HTTP server)
- **Prisma** (ORM)
- **Postgres** (database)
- **Zod** (validation)
- **node-cron** (scheduler)
- **express-rate-limit** (rate limiting)

---

## Setup & Installation

1. **Clone the repo & install dependencies:**
   ```bash
   bun install
   ```
2. **Configure your database:**
   - Create a `.env` file in the root with:
     ```env
     DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
     ```
3. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```
4. **Start the server:**
   ```bash
   bun run src/server.ts
   ```

---

## API Documentation

### Base URL: `/api/urls`

#### **POST /**  — Add a URL to be pinged
- **Body:**
  ```json
  {
    "url": "https://your-backend.com/health",
    "interval": 30
  }
  ```
  - `url`: Must be a valid URL (Zod validated)
  - `interval`: Minutes between pings (integer, 1–1440)
- **Response:** `201 Created`
  ```json
  {
    "id": "uuid",
    "url": "https://your-backend.com/health",
    "interval": 30,
    "createdAt": "2024-07-23T15:20:09.000Z",
    "updatedAt": "2024-07-23T15:20:09.000Z"
  }
  ```
- **Errors:** `400 Bad Request` (invalid input)

#### **GET /**  — List all URLs
- **Response:** `200 OK`
  ```json
  [
    {
      "id": "uuid",
      "url": "https://your-backend.com/health",
      "interval": 30,
      "createdAt": "2024-07-23T15:20:09.000Z",
      "updatedAt": "2024-07-23T15:20:09.000Z"
    }
  ]
  ```

#### **DELETE /:id**  — Remove a URL
- **Response:** `204 No Content`
- **Errors:** `404 Not Found` (if ID does not exist)

---

## Validation & Security
- **All inputs validated** with Zod (strict URL and interval checks)
- **Rate limiting**: 100 requests per 15 minutes per IP
- **CORS** enabled
- **Centralized error handling**
- **Environment variables** never committed

---

## How It Works
- User submits a backend URL and ping interval.
- The service stores the URL and schedules a ping at the specified interval (in minutes).
- Each ping is a simple HTTP GET request (errors are logged, not retried).
- You can list or remove URLs at any time.

---

## Extending & Contributing
- All files are <100 lines and modular for easy maintenance.
- Add new features by creating new controllers, services, or routes.

---

## License
MIT
