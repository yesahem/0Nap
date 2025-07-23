# Backend API Documentation

## User Routes

### 1. Register a User
- **POST** `/api/users/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  `201 Created` with user info (no token issued here).

---

### 2. Login a User *(to be implemented)*
- **POST** `/api/users/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  `200 OK` with `{ "token": "JWT_TOKEN" }`

---

## URL Routes

> **All require JWT in `Authorization: Bearer <token>` header**

### 3. Add a URL to Ping
- **POST** `/api/urls`
- **Headers:**
  `Authorization: Bearer <JWT_TOKEN>`
- **Body:**
  ```json
  {
    "url": "https://your-backend.com/health",
    "interval": 30
  }
  ```
  - `url`: Must be a valid URL.
  - `interval`: Integer (minutes), 1–1440.

---

### 4. List All URLs for the User
- **GET** `/api/urls`
- **Headers:**
  `Authorization: Bearer <JWT_TOKEN>`
- **Response:**
  Array of URLs associated with the authenticated user.

---

### 5. Delete a URL
- **DELETE** `/api/urls/:id`
- **Headers:**
  `Authorization: Bearer <JWT_TOKEN>`
- **URL Param:**
  `:id` = The ID of the URL to delete (from the list endpoint).

---

## How to Test

1. **Register** a user (`/api/users/register`).
2. **(After you implement it) Login** to get a JWT (`/api/users/login`).
3. Use the JWT for all `/api/urls` requests in the `Authorization` header.
4. **Add** a URL (`POST /api/urls`).
5. **List** URLs (`GET /api/urls`).
6. **Delete** a URL (`DELETE /api/urls/:id`).

---

**Note:**
- The login route is not yet implemented. You need to add it to issue JWTs for testing authenticated routes.
- All `/api/urls` routes require a valid JWT. 