// This File Handles Event Business Logic
const EventRepository = require("../repositories/event.repository");
const { NotFound, BadRequest, Forbidden } = require("../../core/errors/errors");

class EventService {
  // Create Event
  async createEvent(eventData, creatorEmail) {
    const eventDate = new Date(eventData.date);
    if (isNaN(eventDate.getTime())) {
      throw new BadRequest("INVALID EVENT DATE!");
    }

    if (eventDate < new Date()) {
      throw new BadRequest("EVENT DATE MUST BE IN THE FUTURE!");
    }

    if (eventData.creatorEmail !== creatorEmail) {
      throw new Forbidden("EMAIL MISMATCH: UNAUTHORIZED CREATOR!");
    }

    const event = {
      ...eventData,
      date: eventDate,
      createdAt: new Date(),
    };

    return EventRepository.createEvent(event);
  }

  // Get Event By ID
  async getEventById(id) {
    const event = await EventRepository.findById(id);
    if (!event) throw new NotFound("EVENT NOT FOUND!");
    return event;
  }

  // Get All Upcoming Events
  async getUpcomingEvents() {
    return EventRepository.findUpcomingEvents();
  }

  // Search Events
  async searchEvents(query) {
    const searchQuery = {};
    
    if (query.type) {
      searchQuery.eventType = { $regex: new RegExp(query.type, "i") };
    }
    if (query.name || query.search) {
      const searchTerm = query.name || query.search;
      searchQuery.title = { $regex: new RegExp(searchTerm, "i") };
    }
    if (query.location) {
      searchQuery.location = { $regex: new RegExp(query.location, "i") };
    }

    return EventRepository.searchEvents(searchQuery);
  }

  // Get Events By Creator
  async getEventsByCreator(creatorEmail) {
    return EventRepository.findByCreatorEmail(creatorEmail);
  }

  // Update Event
  async updateEvent(id, updateData, userEmail) {
    const event = await EventRepository.findById(id);
    if (!event) throw new NotFound("EVENT NOT FOUND!");

    if (event.creatorEmail !== userEmail) {
      throw new Forbidden("FORBIDDEN: NOT YOUR EVENT!");
    }

    if (updateData.date) {
      updateData.date = new Date(updateData.date);
      if (updateData.date < new Date()) {
        throw new BadRequest("EVENT DATE MUST BE IN THE FUTURE!");
      }
    }

    return EventRepository.updateById(id, updateData);
  }

  // Delete Event
  async deleteEvent(id, userEmail) {
    const event = await EventRepository.findById(id);
    if (!event) throw new NotFound("EVENT NOT FOUND!");

    if (event.creatorEmail !== userEmail) {
      throw new Forbidden("FORBIDDEN: NOT YOUR EVENT!");
    }

    return EventRepository.deleteById(id);
  }
}

module.exports = new EventService();

