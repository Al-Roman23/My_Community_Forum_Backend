// This File Handles Joined Event Request And Response
const JoinedEventService = require("../services/joinedEvent.service");
const { BadRequest } = require("../../core/errors/errors");

class JoinedEventController {
  // Join Event
  async joinEvent(req, res, next) {
    try {
      const { eventId } = req.body;
      const userEmail = req.user.email;

      if (!eventId) throw new BadRequest("EVENT ID REQUIRED!");

      const result = await JoinedEventService.joinEvent(eventId, userEmail);

      res.json({
        message: "JOINED EVENT SUCCESSFULLY!",
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get Joined Events By Email (Query Parameter)
  async getJoinedEventsByEmail(req, res, next) {
    try {
      const { email } = req.query;
      if (!email) throw new BadRequest("EMAIL QUERY REQUIRED!");

      const joinedEvents = await JoinedEventService.getJoinedEventsByEmail(
        email
      );
      res.json(joinedEvents);
    } catch (error) {
      next(error);
    }
  }

  // Get My Joined Events With Full Details (Protected)
  async getMyJoinedEvents(req, res, next) {
    try {
      const events = await JoinedEventService.getJoinedEventsWithDetails(
        req.user.email
      );
      res.json(events);
    } catch (error) {
      next(error);
    }
  }

  // Leave Event
  async leaveEvent(req, res, next) {
    try {
      const result = await JoinedEventService.leaveEvent(req.params.id);
      res.json({
        message: "LEFT EVENT SUCCESSFULLY!",
        result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new JoinedEventController();

