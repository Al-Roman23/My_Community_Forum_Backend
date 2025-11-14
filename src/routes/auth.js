// --- MODULE IMPORTS ---
const express = require("express");
const jwt = require("jsonwebtoken");

// --- ROUTER INITIALIZATION ---
const router = express.Router();

// --- JWT SECRET ---
const JWT_SECRET = process.env.JWT_SECRET || "development_secret";

// --- JWT TOKEN GENERATION FUNCTION ---
const generateJWT = (user) => {
  const payload = { email: user.email, role: user.role || "user" };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "5h" });
};

// --- FIREBASE TOKEN VERIFICATION MIDDLEWARE ---
const verifyFirebaseToken = (admin) => async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).send({ message: "UNAUTHORIZED ACCESS!" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).send({ message: "UNAUTHORIZED ACCESS!" });

  try {
    const decodedUser = await admin.auth().verifyIdToken(token);
    req.token_email = decodedUser.email;
    next();
  } catch (err) {
    console.error("FIREBASE VERIFICATION FAILED: ", err);
    return res.status(401).send({ message: "UNAUTHORIZED ACCESS!" });
  }
};

// --- AUTH ROUTE: ISSUE JWT TOKEN ---
router.post("/getToken", verifyFirebaseToken, async (req, res) => {
  try {
    const token = generateJWT({ email: req.token_email });
    res.send({ token });
  } catch (err) {
    console.error("ERROR GENERATING JWT: ", err);
    res.status(500).send({ message: "FAILED TO GENERATE TOKEN" });
  }
});

// --- AUTH ROUTE: VERIFY FIREBASE TOKEN ---
router.get("/verify", verifyFirebaseToken, (req, res) => {
  res.send({
    message: "TOKEN VERIFIED SUCCESSFULLY",
    email: req.token_email,
  });
});

// --- ROUTER EXPORT FUNCTION ---
module.exports = (client, admin) => {
  router.use((req, res, next) => {
    req.admin = admin;
    next();
  });

  return router;
};
