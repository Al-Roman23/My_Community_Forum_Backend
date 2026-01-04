// This File Defines Event API Routes
const express = require("express");
const EventController = require("../controllers/event.controller");
const verifyAuthToken = require("../../middlewares/verifyAuthToken");

const router = express.Router();

// Get All Upcoming Events (Public)
router.get("/", EventController.getAllEvents);

// Search Events (Public)
router.get("/search", EventController.searchEvents);

// Get Events Created By User (Protected)
router.get("/my-events", verifyAuthToken, EventController.getMyEvents);

// Get Event By ID (Public)
router.get("/:id", EventController.getEventById);

// Create Event (Protected)
router.post("/", verifyAuthToken, EventController.createEvent);

// Update Event (Protected)
router.patch("/:id", verifyAuthToken, EventController.updateEvent);

// Delete Event (Protected)
router.delete("/:id", verifyAuthToken, EventController.deleteEvent);

module.exports = router;
