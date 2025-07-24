# Testing the Backend Flow

## Prerequisites
1. Make sure your `.env` file has `JWT_SECRET=your-secret-key`
2. Start the server: `bun run dev`
3. Server should be running on `http://localhost:4000`

## Step-by-Step Testing

### 1. Register a User
```bash
curl -X POST http://localhost:4000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```
**Expected Response:** `201 Created` with user info

### 2. Login to Get JWT Token
```bash
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```
**Expected Response:** `{ "token": "JWT_TOKEN_HERE" }`

**Save this token for the next steps!**

### 3. Add a URL to Ping
```bash
curl -X POST http://localhost:4000/api/urls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "url": "https://httpbin.org/status/200",
    "interval": 1
  }'
```
**Expected Response:** `201 Created` with URL info including `pingCount: 0`

### 4. List Your URLs
```bash
curl -X GET http://localhost:4000/api/urls \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```
**Expected Response:** Array of URLs with `pingCount` field

### 5. Watch the Magic Happen! 🎉

**Check server console logs:**
- You should see: `📅 Scheduled https://httpbin.org/status/200 to ping every 1 minutes`
- Every minute: `✅ Pinged https://httpbin.org/status/200 - Status: 200`cursor-pointer

**Check the database:**
```bash
# List URLs again to see updated pingCount
curl -X GET http://localhost:4000/api/urls \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

The `pingCount` should increment every minute!

### 6. Delete a URL (Optional)
```bash
curl -X DELETE http://localhost:4000/api/urls/URL_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

<!-- testing the CI workflow -->


## What You Should See

1. **Console logs** showing scheduled pings and successful requests
2. **Database counter** (`pingCount`) incrementing with each ping
3. **User-specific URLs** (each user only sees their own URLs)
4. **Authentication working** (401 errors without valid JWT)

## Test with Different URLs

Try these URLs to see different behaviors:
- `https://httpbin.org/status/200` - Always returns 200
- `https://httpbin.org/delay/2` - Delayed response
- `https://httpbin.org/status/500` - Server error (will still increment counter)
- `https://invalid-url-that-does-not-exist.com` - Network error (won't increment) 