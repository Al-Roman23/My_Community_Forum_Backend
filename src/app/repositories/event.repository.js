// This File Handles Event Database Operations
const { getCollection } = require("../../config/db");
const { ObjectId } = require("mongodb");

class EventRepository {
  // Create New Event
  async createEvent(event) {
    const eventsCollection = await getCollection("events");
    return eventsCollection.insertOne(event);
  }

  // Find Event By ID
  async findById(id) {
    const eventsCollection = await getCollection("events");
    return eventsCollection.findOne({ _id: new ObjectId(id) });
  }

  // Find All Upcoming Events
  async findUpcomingEvents() {
    const eventsCollection = await getCollection("events");
    const today = new Date();
    return eventsCollection
      .find({ date: { $gte: today } })
      .sort({ date: 1 })
      .toArray();
  }

  // Search Events By Query
  async searchEvents(query) {
    const eventsCollection = await getCollection("events");
    return eventsCollection.find(query).toArray();
  }

  // Find Events By Creator Email
  async findByCreatorEmail(creatorEmail) {
    const eventsCollection = await getCollection("events");
    return eventsCollection
      .find({ creatorEmail })
      .sort({ date: 1 })
      .toArray();
  }

  // Update Event By ID
  async updateById(id, updateData) {
    const eventsCollection = await getCollection("events");
    return eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

  // Delete Event By ID
  async deleteById(id) {
    const eventsCollection = await getCollection("events");
    return eventsCollection.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = new EventRepository();

