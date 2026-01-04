// This File Initializes Express Application And Registers All Routes
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const logger = require("./src/utils/logger");
const { connectDB, ensureIndexes, client } = require("./src/config/db");
const { errorHandler } = require("./src/middlewares/errorHandler");

// Import Routes
const userRoutes = require("./src/app/routes/user.routes");
const eventRoutes = require("./src/app/routes/event.routes");
const joinedEventRoutes = require("./src/app/routes/joinedEvent.routes");
const authRoutes = require("./src/app/routes/auth.routes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware To Parse JSON And Handle CORS
app.use(
  cors({
    origin: [
      "https://mycommunityforum.vercel.app",
      "https://mycommunityforum.web.app",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Health Check Route
app.get("/", async (req, res) => {
  try {
    await client.db().command({ ping: 1 });
    res.json({
      success: true,
      message: "MongoDB Connected And Server Running!",
    });
  } catch (err) {
    logger.error({ err }, "Health Check Failed!");
    res
      .status(500)
      .json({ success: false, message: "MongoDB Connection Failed!" });
  }
});

// Register API Routes
app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/joinedEvents", joinedEventRoutes);
app.use("/auth", authRoutes);

// Global Error Handling Middleware
app.use(errorHandler);

let serverInstance;

// Start Server After Connecting To MongoDB And Ensuring Indexes
async function startServer() {
  try {
    await connectDB();
    await ensureIndexes();

    serverInstance = app.listen(port, () => {
      logger.info(`SERVER IS RUNNING ON PORT: ${port}`);
    });
  } catch (error) {
    logger.fatal({ error }, "Failed To Start Server!");
    process.exit(1);
  }
}

// Graceful Shutdown Handler
async function shutdown(signal) {
  try {
    logger.info(`Received ${signal}. Closing Server And MongoDB Connection...`);

    if (serverInstance) {
      await new Promise((resolve) => serverInstance.close(resolve));
      logger.info("HTTP Server Closed Successfully!");
    }

    await client.close();
    logger.info("MongoDB Connection Closed Successfully!");
    process.exit(0);
  } catch (err) {
    logger.fatal({ err }, "Error During Shutdown!");
    process.exit(1);
  }
}

// Listen For Termination Signals
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Export For Vercel
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // Start The Server Locally
  startServer();
}
