// This File Handles Event Request And Response
const EventService = require("../services/event.service");
const JoinedEventRepository = require("../repositories/joinedEvent.repository");
const { BadRequest } = require("../../core/errors/errors");
const { validateCreateEvent } = require("../validators/event.validator");

class EventController {
  // Create Event
  async createEvent(req, res, next) {
    try {
      const eventData = req.body;

      // Validate Event Input
      const validation = validateCreateEvent(eventData);
      if (!validation.valid) throw new BadRequest(validation.message);

      const result = await EventService.createEvent(eventData, req.user.email);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get All Upcoming Events
  async getAllEvents(req, res, next) {
    try {
      const events = await EventService.getUpcomingEvents();
      res.json(events);
    } catch (error) {
      next(error);
    }
  }

  // Search Events
  async searchEvents(req, res, next) {
    try {
      const events = await EventService.searchEvents(req.query);
      res.json(events);
    } catch (error) {
      next(error);
    }
  }

  // Get Events Created By User
  async getMyEvents(req, res, next) {
    try {
      const events = await EventService.getEventsByCreator(req.user.email);
      if (events.length === 0) {
        return res.json({
          message: "NO EVENTS FOUND FOR THIS USER",
          events: [],
        });
      }
      res.json(events);
    } catch (error) {
      next(error);
    }
  }

  // Get Event By ID
  async getEventById(req, res, next) {
    try {
      const event = await EventService.getEventById(req.params.id);
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  // Update Event
  async updateEvent(req, res, next) {
    try {
      const result = await EventService.updateEvent(
        req.params.id,
        req.body,
        req.user.email
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Delete Event
  async deleteEvent(req, res, next) {
    try {
      const eventId = req.params.id;

      // Delete all joined events for this event
      await JoinedEventRepository.deleteByEventId(eventId);

      // Delete the event
      await EventService.deleteEvent(eventId, req.user.email);

      res.json({
        message: "Event and all joined records deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventController();

