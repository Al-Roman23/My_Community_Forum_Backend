// --- MODULE IMPORTS ---
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const admin = require("firebase-admin");
require("dotenv").config();

const app = express();

// --- FIREBASE ADMIN ---
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
app.use(cors());
app.use(express.json());

// --- MONGODB CLIENT ---
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mycommunityforumcluster.3qgolgq.mongodb.net/?appName=myCommunityForumCluster`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbConnection = null;

async function connectDB() {
  if (dbConnection) return dbConnection;
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("DATABASE CONNECTED SUCCESSFULLY!");
  dbConnection = client;
  return dbConnection;
}

// --- ROOT ROUTE ---
app.get("/", (req, res) => {
  res.send("SERVER IS RUNNING!");
});

// --- DB CONNECTION MIDDLEWARE ---
app.use(async (req, res, next) => {
  if (!dbConnection) {
    try {
      await connectDB();
    } catch (err) {
      console.error("DB connection failed:", err);
      return res.status(500).json({ message: "Database unavailable" });
    }
  }
  next();
});

// --- ROUTES ---
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const eventsRoutes = require("./routes/events");
const joinedEventsRoutes = require("./routes/joinedEvents");

app.use("/auth", authRoutes(client, admin));
app.use("/users", usersRoutes(client, admin));
app.use("/events", eventsRoutes(client, admin));
app.use("/joinedEvents", joinedEventsRoutes(client, admin));

// --- ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error("UNHANDLED ERROR: ", err);
  res.status(500).json({
    message: "INTERNAL SERVER ERROR",
    error: err.message,
  });
});

// --- EXPORT / SERVER START ---
if (process.env.VERCEL) {
  module.exports = app;
} else {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT: ${port}`);
  });
}
