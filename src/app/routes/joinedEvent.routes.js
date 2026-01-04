// This File Defines Joined Event API Routes
const express = require("express");
const JoinedEventController = require("../controllers/joinedEvent.controller");
const verifyAuthToken = require("../../middlewares/verifyAuthToken");

const router = express.Router();

// Get Joined Events By Email (Query Parameter - Public)
router.get("/", JoinedEventController.getJoinedEventsByEmail);

// Get My Joined Events With Full Details (Protected)
router.get("/my-joined", verifyAuthToken, JoinedEventController.getMyJoinedEvents);

// Join Event (Protected)
router.post("/", verifyAuthToken, JoinedEventController.joinEvent);

// Leave Event (Protected)
router.delete("/:id", verifyAuthToken, JoinedEventController.leaveEvent);

module.exports = router;

