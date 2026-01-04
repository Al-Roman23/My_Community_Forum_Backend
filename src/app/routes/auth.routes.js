// This File Defines Auth API Routes
const express = require("express");
const AuthController = require("../controllers/auth.controller");
const verifyAuthToken = require("../../middlewares/verifyAuthToken");

const router = express.Router();

// Issue JWT Token (Protected)
router.post("/getToken", verifyAuthToken, AuthController.getToken);

// Verify Firebase Token (Protected)
router.get("/verify", verifyAuthToken, AuthController.verifyToken);

module.exports = router;
