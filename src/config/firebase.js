// Import Required Packages
const admin = require("firebase-admin");
require("dotenv").config();

// Initialize Firebase Admin Only Once
if (!admin.apps.length) {
  // Decode Base64 Encoded Firebase Service Key
  const decoded = Buffer.from(
    process.env.FIREBASE_SERVICE_KEY,
    "base64"
  ).toString("utf8");
  const serviceAccount = JSON.parse(decoded);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Export Initialized Admin
module.exports = admin;
