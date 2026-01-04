// Centralized Error Handling Middleware
const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  // Log The Error Details
  logger.error({ err, path: req.path, method: req.method }, "Error Occurred");

  // Determine Status Code And Message
  const status = err.status || 500;
  const message = err.message || "INTERNAL SERVER ERROR";

  // Send JSON Response With Error Information
  res.status(status).json({ 
    message,
    ...(process.env.NODE_ENV === "development" && { error: err.stack })
  });
}

module.exports = { errorHandler };
