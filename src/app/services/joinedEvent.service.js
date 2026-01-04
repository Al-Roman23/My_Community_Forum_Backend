// This File Handles Joined Event Business Logic
const JoinedEventRepository = require("../repositories/joinedEvent.repository");
const EventRepository = require("../repositories/event.repository");
const { Conflict, NotFound, BadRequest } = require("../../core/errors/errors");

class JoinedEventService {
  // Join Event
  async joinEvent(eventId, userEmail) {
    // Check if event exists
    const event = await EventRepository.findById(eventId);
    if (!event) throw new NotFound("EVENT DOES NOT EXIST!");

    // Check if already joined
    const existingJoin = await JoinedEventRepository.findByUserAndEvent(
      userEmail,
      eventId
    );
    if (existingJoin) throw new Conflict("ALREADY JOINED THIS EVENT!");

    const joinData = {
      eventId: eventId.toString(),
      userEmail,
      joinedAt: new Date(),
    };

    return JoinedEventRepository.createJoinedEvent(joinData);
  }

  // Get Joined Events By Email
  async getJoinedEventsByEmail(userEmail) {
    return JoinedEventRepository.findByUserEmail(userEmail);
  }

  // Get Full Joined Events With Details
  async getJoinedEventsWithDetails(userEmail) {
    const events = await JoinedEventRepository.getJoinedEventsWithDetails(
      userEmail
    );
    if (events.length === 0) {
      return { message: "NO JOINED EVENTS FOUND", events: [] };
    }
    return events;
  }

  // Leave Event
  async leaveEvent(joinId) {
    const result = await JoinedEventRepository.deleteById(joinId);
    if (result.deletedCount === 0) {
      throw new NotFound("JOINED EVENT NOT FOUND!");
    }
    return result;
  }
}

module.exports = new JoinedEventService();

