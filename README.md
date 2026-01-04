# My Community Forum Backend API

**Author:** Al-Roman Molla  
**Live Site:** [https://mycommunityforum.web.app/](https://mycommunityforum.web.app/)  
**GitHub (Frontend):** [Frontend Repository](https://github.com/Al-Roman23/My_Community_Forum_Frontend)  
**GitHub (Backend):** [Backend Repository](https://github.com/Al-Roman23/My_Community_Forum_Backend)

---

## Project Overview

This is the backend API server for **My Community Forum**, a community-driven event management platform. The server is built with **Node.js, Express.js, MongoDB, and Firebase Admin SDK**, following a clean architecture pattern with separation of concerns.

---

## Architecture

The project follows a **layered architecture** pattern:

```
ServeR/
├── server.js              # Main entry point
├── src/
│   ├── app/
│   │   ├── controllers/   # Request/Response handling
│   │   ├── services/      # Business logic
│   │   ├── repositories/  # Database operations
│   │   ├── routes/         # API route definitions
│   │   └── validators/     # Input validation
│   ├── config/            # Configuration files
│   │   ├── db.js          # MongoDB connection
│   │   └── firebase.js     # Firebase Admin setup
│   ├── core/
│   │   └── errors/        # Custom error classes
│   ├── middlewares/       # Express middlewares
│   └── utils/             # Utility functions
```

---

## API Endpoints

### Users (`/users`)
- `POST /users` - Create user (Public)
- `GET /users/me` - Get current user (Protected)
- `GET /users` - Get all users (Admin only, Protected)
- `GET /users/:email` - Get user by email (Public)
- `PATCH /users/:email` - Update user (Protected)
- `DELETE /users/:email` - Delete user (Protected)

### Events (`/events`)
- `GET /events` - Get all upcoming events (Public)
- `GET /events/search` - Search events (Public)
- `GET /events/my-events` - Get user's events (Protected)
- `GET /events/:id` - Get event by ID (Public)
- `POST /events` - Create event (Protected)
- `PATCH /events/:id` - Update event (Protected)
- `DELETE /events/:id` - Delete event (Protected)

### Joined Events (`/joinedEvents`)
- `GET /joinedEvents?email=...` - Get joined events by email (Public)
- `GET /joinedEvents/my-joined` - Get my joined events with details (Protected)
- `POST /joinedEvents` - Join an event (Protected)
- `DELETE /joinedEvents/:id` - Leave an event (Protected)

### Auth (`/auth`)
- `POST /auth/getToken` - Get JWT token (Protected)
- `GET /auth/verify` - Verify Firebase token (Protected)

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
DB_NAME=my_community_forum_db

# Firebase Admin SDK (Base64 Encoded)
FIREBASE_SERVICE_KEY=your_base64_encoded_firebase_service_account_json

# JWT Secret (Optional)
JWT_SECRET=your_jwt_secret_key

# Server Port (Optional)
PORT=5000

# Node Environment (Optional)
NODE_ENV=development
```

To encode your Firebase service account JSON:
```bash
node encode.js
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Firebase project with Admin SDK

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Al-Roman23/My_Community_Forum_Backend.git
   cd My_Community_Forum_Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your MongoDB and Firebase credentials
   - Run `node encode.js` to get your Firebase service key

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Run the production server**
   ```bash
   npm start
   ```

---

## Database Collections

- `users` - User accounts
- `events` - Community events
- `joinedEvents` - User event participation records

---

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via MongoDB Driver)
- **Firebase Admin SDK** - Server-side authentication
- **JWT** - Token generation
- **Pino** - Logging
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

---

## Project Structure

```
ServeR/
├── server.js              # Main entry point
├── src/
│   ├── app/
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic layer
│   │   ├── repositories/  # Data access layer
│   │   ├── routes/        # Route definitions
│   │   └── validators/    # Input validation
│   ├── config/            # Configuration
│   ├── core/              # Core utilities
│   ├── middlewares/       # Express middlewares
│   └── utils/             # Helper functions
├── .env                   # Environment variables (not in git)
└── package.json           # Dependencies
```

---

## Error Handling

The server uses custom error classes for consistent error responses:
- `BadRequest` (400)
- `Unauthorized` (401)
- `Forbidden` (403)
- `NotFound` (404)
- `Conflict` (409)
- `InternalError` (500)

---

## Security Features

- Firebase token verification middleware
- Role-based access control
- Input validation
- CORS configuration
- Environment variable protection

---

## Deployment

### Vercel Deployment

The server is configured for Vercel deployment. Make sure to:
1. Set environment variables in Vercel dashboard
2. Deploy using Vercel CLI or GitHub integration

### Local Deployment

```bash
npm start
```

---

## License

This project is part of Module-59 coursework.

---

## Contact

- **Author**: Al-Roman Molla
- **Email**: mycommunityforum@gmail.com

