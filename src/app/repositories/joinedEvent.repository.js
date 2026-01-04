// This File Handles Joined Event Database Operations
const { getCollection } = require("../../config/db");
const { ObjectId } = require("mongodb");

class JoinedEventRepository {
  // Create Joined Event
  async createJoinedEvent(joinData) {
    const joinedEventsCollection = await getCollection("joinedEvents");
    return joinedEventsCollection.insertOne(joinData);
  }

  // Find Joined Event By User Email And Event ID
  async findByUserAndEvent(userEmail, eventId) {
    const joinedEventsCollection = await getCollection("joinedEvents");
    return joinedEventsCollection.findOne({
      userEmail,
      eventId: eventId.toString(),
    });
  }

  // Find All Joined Events By User Email
  async findByUserEmail(userEmail) {
    const joinedEventsCollection = await getCollection("joinedEvents");
    return joinedEventsCollection
      .find({ userEmail })
      .sort({ joinedAt: -1 })
      .toArray();
  }

  // Get Full Event Details For Joined Events
  async getJoinedEventsWithDetails(userEmail) {
    const joinedEventsCollection = await getCollection("joinedEvents");
    const eventsCollection = await getCollection("events");

    const joinedEvents = await joinedEventsCollection
      .find({ userEmail })
      .sort({ joinedAt: -1 })
      .toArray();

    if (joinedEvents.length === 0) return [];

    const eventIds = joinedEvents.map((e) => new ObjectId(e.eventId));
    const events = await eventsCollection
      .find({ _id: { $in: eventIds } })
      .sort({ date: 1 })
      .toArray();

    return events;
  }

  // Delete Joined Event By ID
  async deleteById(id) {
    const joinedEventsCollection = await getCollection("joinedEvents");
    return joinedEventsCollection.deleteOne({ _id: new ObjectId(id) });
  }

  // Delete All Joined Events For An Event
  async deleteByEventId(eventId) {
    const joinedEventsCollection = await getCollection("joinedEvents");
    const eventIdString = eventId.toString();
    return joinedEventsCollection.deleteMany({
      $or: [
        { eventId: eventIdString },
        { eventId: new ObjectId(eventId) },
      ],
    });
  }
}

module.exports = new JoinedEventRepository();

