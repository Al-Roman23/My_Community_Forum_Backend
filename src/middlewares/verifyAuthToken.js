// Middleware To Verify Firebase Token And Attach User Info
const admin = require("../config/firebase");
const { Unauthorized } = require("../core/errors/errors");
const logger = require("../utils/logger");

async function verifyAuthToken(req, res, next) {
  try {
    const header = req.headers.authorization || req.headers.Authorization;

    // Check If Authorization Header Exists And Starts With Bearer
    if (!header || !header.startsWith("Bearer ")) {
      logger.warn({ header }, "Missing Auth Token!");
      throw new Unauthorized("Missing Auth Token!");
    }

    // Extract Token And Verify Using Firebase Admin
    const token = header.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    // Attach Decoded User Info To Request
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: decoded.role || null,
    };

    // Also attach email for backward compatibility
    req.token_email = decoded.email;

    next();
  } catch (err) {
    // Log Any Unexpected Errors
    logger.error({ err, email: req.user?.email }, "Authentication Failed!");
    // Pass Custom Unauthorized Error To Express Error Handler
    next(new Unauthorized("Invalid Or Expired Token!"));
  }
}

module.exports = verifyAuthToken;
