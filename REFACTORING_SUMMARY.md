# Server Refactoring Summary

## Overview
The old server code has been successfully refactored into the new folder structure following the established pattern.

## New Folder Structure

```
ServeR/
├── server.js (Main entry point)
├── src/
│   ├── app/
│   │   ├── controllers/     (Request/Response handling)
│   │   │   ├── user.controller.js
│   │   │   ├── event.controller.js
│   │   │   ├── joinedEvent.controller.js
│   │   │   └── auth.controller.js
│   │   ├── services/        (Business logic)
│   │   │   ├── user.service.js
│   │   │   ├── event.service.js
│   │   │   └── joinedEvent.service.js
│   │   ├── repositories/    (Database operations)
│   │   │   ├── user.repository.js
│   │   │   ├── event.repository.js
│   │   │   └── joinedEvent.repository.js
│   │   ├── routes/          (API route definitions)
│   │   │   ├── user.routes.js
│   │   │   ├── event.routes.js
│   │   │   ├── joinedEvent.routes.js
│   │   │   └── auth.routes.js
│   │   └── validators/      (Input validation)
│   │       ├── user.validator.js
│   │       └── event.validator.js
│   ├── config/
│   │   ├── db.js            (MongoDB configuration)
│   │   └── firebase.js      (Firebase Admin configuration)
│   ├── core/
│   │   └── errors/
│   │       └── errors.js    (Custom error classes)
│   ├── middlewares/
│   │   ├── verifyAuthToken.js
│   │   ├── checkUserStatus.js
│   │   └── errorHandler.js
│   └── utils/
│       └── logger.js
```

## Key Changes

### 1. Configuration Files
- **db.js**: Updated MongoDB connection string to match old code
- **firebase.js**: Changed to use base64-encoded service key from environment variable

### 2. User Module
- **Repository**: Added methods for CRUD operations
- **Service**: Business logic for user operations
- **Controller**: Request/response handling
- **Routes**: `/users` endpoints (POST, GET, GET /:email, PATCH /:email, DELETE /:email, GET /me)

### 3. Event Module
- **Repository**: Database operations for events
- **Service**: Business logic including validation
- **Controller**: Event CRUD operations
- **Routes**: `/events` endpoints (GET, GET /search, GET /my-events, GET /:id, POST, PATCH /:id, DELETE /:id)

### 4. JoinedEvent Module
- **Repository**: Database operations for joined events
- **Service**: Business logic for joining/leaving events
- **Controller**: Joined event operations
- **Routes**: `/joinedEvents` endpoints (GET, GET /my-joined, POST, DELETE /:id)

### 5. Auth Module
- **Controller**: JWT token generation and verification
- **Routes**: `/auth` endpoints (POST /getToken, GET /verify)

### 6. Server.js
- Updated to use new route structure
- Maintains same functionality as old code
- Routes are registered without `/api` prefix to match client expectations

## API Endpoints

### Users
- `POST /users` - Create user (Public)
- `GET /users/me` - Get current user (Protected)
- `GET /users` - Get all users (Admin only, Protected)
- `GET /users/:email` - Get user by email (Public)
- `PATCH /users/:email` - Update user (Protected)
- `DELETE /users/:email` - Delete user (Protected)

### Events
- `GET /events` - Get all upcoming events (Public)
- `GET /events/search` - Search events (Public)
- `GET /events/my-events` - Get user's events (Protected)
- `GET /events/:id` - Get event by ID (Public)
- `POST /events` - Create event (Protected)
- `PATCH /events/:id` - Update event (Protected)
- `DELETE /events/:id` - Delete event (Protected)

### Joined Events
- `GET /joinedEvents?email=...` - Get joined events by email (Public)
- `GET /joinedEvents/my-joined` - Get my joined events with details (Protected)
- `POST /joinedEvents` - Join an event (Protected)
- `DELETE /joinedEvents/:id` - Leave an event (Protected)

### Auth
- `POST /auth/getToken` - Get JWT token (Protected)
- `GET /auth/verify` - Verify Firebase token (Protected)

## Environment Variables Required

```env
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
DB_NAME=my_community_forum_db
FIREBASE_SERVICE_KEY=base64_encoded_firebase_service_account_json
JWT_SECRET=your_jwt_secret (optional, defaults to "development_secret")
PORT=5000 (optional, defaults to 5000)
```

## Database Collections

- `users` - User accounts
- `events` - Community events
- `joinedEvents` - User event participation records

## Notes

1. All routes maintain backward compatibility with the old API structure
2. Error handling uses custom error classes for consistent responses
3. Firebase authentication is verified via middleware
4. Database indexes are automatically created on server start
5. The server supports both local development and Vercel deployment

## Testing

To test the server:
1. Set up environment variables in `.env` file
2. Run `npm run dev` for development or `npm start` for production
3. The server will connect to MongoDB and ensure indexes on startup
4. Health check available at `GET /`

