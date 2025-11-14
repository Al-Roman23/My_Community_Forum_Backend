// --- MODULE IMPORTS ---
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const admin = require("firebase-admin");
require("dotenv").config();

// --- EXPRESS APP INITIALIZATION ---
const app = express();

// --- FIREBASE ADMIN INITIALIZATION ---
const decoded = Buffer.from(
  process.env.FIREBASE_SERVICE_KEY,
  "base64"
).toString("utf8");
const serviceAccount = JSON.parse(decoded);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// --- MIDDLEWARE ---
app.use(
  cors({
    origin: [
      "https://mycommunityforum.vercel.app",
      "https://mycommunityforum.web.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());

// --- MONGODB CLIENT ---
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mycommunityforumcluster.3qgolgq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbConnection = null;

// --- CONNECT TO DATABASE ---
async function connectDB() {
  if (dbConnection) return dbConnection;
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("DATABASE CONNECTED SUCCESSFULLY!");
  dbConnection = client;
  return dbConnection;
}

// --- ROUTES ---
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const eventsRoutes = require("./routes/events");
const joinedEventsRoutes = require("./routes/joinedEvents");

// --- TEST ROUTE ---
app.get("/", (req, res) => {
  res.send("SERVER IS RUNNING!");
});

// --- ATTACH DB CONNECTION ---
app.use(async (req, res, next) => {
  if (!dbConnection) {
    try {
      await connectDB();
    } catch (err) {
      console.error("DB CONNECTION FAILED:", err);
      return res.status(500).json({ message: "Database unavailable" });
    }
  }
  req.app.locals.client = dbConnection;
  next();
});

// --- ROUTER MIDDLEWARE ---
app.use("/auth", authRoutes(client, admin));
app.use("/users", usersRoutes(client, admin));
app.use("/events", eventsRoutes(client, admin));
app.use("/joinedEvents", joinedEventsRoutes(client, admin));

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error("UNHANDLED ERROR:", err);
  res
    .status(500)
    .json({ message: "INTERNAL SERVER ERROR", error: err.message });
});

// --- EXPORT FOR VERCEL ---
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // --- START SERVER LOCALLY ---
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT: ${port}`);
  });
}
