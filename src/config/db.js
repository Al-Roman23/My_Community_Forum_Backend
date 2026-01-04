// MongoDB Configuration And Connection Utilities
const { MongoClient, ServerApiVersion } = require("mongodb");
const logger = require("../utils/logger");
require("dotenv").config();

// Validate Environment Variables And Fail Fast If Missing
["DB_USER", "DB_PASS", "DB_NAME"].forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing Required Environment Variable: ${key}!`);
  }
});

// Database Name Constant
const DB_NAME = process.env.DB_NAME || "my_community_forum_db";

// MongoDB Connection Uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mycommunityforumcluster.3qgolgq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// MongoClient Initialization And Configuration
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
});

let dbInstance = null;

// Connect To MongoDB And Cache Database Instance
async function connectDB() {
  if (dbInstance) return dbInstance;

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    dbInstance = client.db(DB_NAME);
    logger.info("MongoDb Connected!");
    return dbInstance;
  } catch (err) {
    logger.error({ err }, "MongoDb Connection Failed!");
    throw err;
  }
}

// Ensure Required Database Indexes Exist
async function ensureIndexes() {
  try {
    const db = await connectDB();
    const usersCollection = db.collection("users");
    const eventsCollection = db.collection("events");
    const joinedEventsCollection = db.collection("joinedEvents");

    // Users Indexes
    await usersCollection.createIndex({ email: 1 }, { unique: true });

    // Events Indexes
    await eventsCollection.createIndex({ creatorEmail: 1 });
    await eventsCollection.createIndex({ date: 1 });
    await eventsCollection.createIndex({ eventType: 1 });

    // Joined Events Indexes
    await joinedEventsCollection.createIndex({ userEmail: 1 });
    await joinedEventsCollection.createIndex({ eventId: 1 });
    await joinedEventsCollection.createIndex(
      { userEmail: 1, eventId: 1 },
      { unique: true }
    );

    logger.info("Database Indexes Ensured!");
  } catch (err) {
    logger.fatal({ err }, "Failed To Ensure Database Indexes!");
    throw err; // Do Not Start Server If Indexes Fail!
  }
}

// Get Database Collection By Name
async function getCollection(name) {
  const db = await connectDB();
  return db.collection(name);
}

module.exports = {
  connectDB,
  ensureIndexes,
  getCollection,
  client,
  DB_NAME,
};
