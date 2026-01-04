// Middleware To Check User Status And Attach Current User Info
const { getCollection } = require("../config/db");
const { Forbidden } = require("../core/errors/errors");
const logger = require("../utils/logger");

async function checkUserStatus(req, res, next) {
  try {
    // Get Users Collection From Database
    const usersCollection = await getCollection("users");

    // Find User By Email From Request
    const user = await usersCollection.findOne({ email: req.user.email });

    // Check If User Is Not Registered
    if (!user) {
      logger.warn({ email: req.user.email }, "User Not Registered!");
      throw new Forbidden("User Not Registered!");
    }

    // Check If User Account Is Suspended
    if (user.suspend?.isSuspended) {
      logger.warn({ email: req.user.email }, "Account Suspended!");
      throw new Forbidden("Account Suspended!");
    }

    // Attach Current User To Request
    req.currentUser = user;
    next();
  } catch (err) {
    // Log Any Unexpected Errors
    logger.error({ err, email: req.user?.email }, "Check User Status Failed!");
    next(err); // Pass To Express Error Handler
  }
}

module.exports = checkUserStatus;
