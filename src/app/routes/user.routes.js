// This File Defines User API Routes
const express = require("express");
const UserController = require("../controllers/user.controller");
const verifyAuthToken = require("../../middlewares/verifyAuthToken");

const router = express.Router();

// Route To Register New User (Public)
router.post("/", UserController.createUser);

// Get Current User (Protected)
router.get("/me", verifyAuthToken, UserController.getMe);

// Get All Users (Admin Only - Protected)
router.get("/", verifyAuthToken, UserController.getAllUsers);

// Get User By Email (Public)
router.get("/:email", UserController.getUserByEmail);

// Update User (Protected)
router.patch("/:email", verifyAuthToken, UserController.updateUser);

// Delete User (Protected)
router.delete("/:email", verifyAuthToken, UserController.deleteUser);

module.exports = router;
