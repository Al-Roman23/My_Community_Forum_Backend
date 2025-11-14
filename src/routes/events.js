// --- MODULE IMPORTS ---
const express = require("express");
const { ObjectId } = require("mongodb");

// --- ROUTER INITIALIZATION ---
const router = express.Router();

// --- FIREBASE TOKEN VERIFICATION MIDDLEWARE ---
const verifyFirebaseToken = (admin) => async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).send({ message: "UNAUTHORIZED ACCESS!" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).send({ message: "UNAUTHORIZED ACCESS!" });

  try {
    const decodedUser = await admin.auth().verifyIdToken(token);
    req.token_email = decodedUser.email;
    console.log("Verified Firebase User: ", decodedUser.email);
    next();
  } catch (err) {
    console.error("FIREBASE VERIFICATION FAILED: ", err);
    return res.status(401).send({ message: "UNAUTHORIZED ACCESS!" });
  }
};

// --- ROUTER EXPORT FUNCTION ---
module.exports = (client, admin) => {
  router.use((req, res, next) => {
    req.app.locals.client = client;
    next();
  });

  // --- CREATE EVENT ---
  router.post("/", verifyFirebaseToken(admin), async (req, res) => {
    try {
      const {
        title,
        description,
        eventType,
        thumbnail,
        location,
        date,
        creatorEmail,
      } = req.body;

      if (
        !title ||
        !description ||
        !eventType ||
        !thumbnail ||
        !location ||
        !date ||
        !creatorEmail
      ) {
        return res.status(400).send({ message: "ALL FIELDS ARE REQUIRED!" });
      }

      const eventDate = new Date(date);
      if (eventDate < new Date()) {
        return res
          .status(400)
          .send({ message: "EVENT DATE MUST BE IN THE FUTURE!" });
      }

      if (creatorEmail !== req.token_email) {
        return res
          .status(403)
          .send({ message: "EMAIL MISMATCH: UNAUTHORIZED CREATOR!" });
      }

      const eventsCollection = req.app.locals.client
        .db("my_community_forum_db")
        .collection("events");

      const result = await eventsCollection.insertOne(req.body);
      res.send(result);
    } catch (err) {
      console.error("ERROR CREATING EVENT: ", err);
      res.status(500).send({ message: "FAILED TO CREATE EVENT!" });
    }
  });

  // --- GET ALL UPCOMING EVENTS ---
  router.get("/", async (req, res) => {
    try {
      const eventsCollection = req.app.locals.client
        .db("my_community_forum_db")
        .collection("events");

      const today = new Date();
      const events = await eventsCollection
        .find({ date: { $gte: today.toISOString() } })
        .toArray();

      res.send(events);
    } catch (err) {
      console.error("ERROR FETCHING EVENTS: ", err);
      res.status(500).send({ message: "FAILED TO FETCH EVENTS!" });
    }
  });

  // --- SEARCH EVENTS BY TYPE OR NAME ---
  router.get("/search", async (req, res) => {
    try {
      const { type, name } = req.query;
      const query = {};

      if (type) query.eventType = { $regex: new RegExp(type, "i") };
      if (name) query.title = { $regex: new RegExp(name, "i") };

      const eventsCollection = req.app.locals.client
        .db("my_community_forum_db")
        .collection("events");

      const events = await eventsCollection.find(query).toArray();
      res.send(events);
    } catch (err) {
      console.error("ERROR FILTERING/SEARCHING EVENTS: ", err);
      res.status(500).send({ message: "FAILED TO SEARCH EVENTS!" });
    }
  });

  // --- GET EVENTS CREATED BY THE LOGGED-IN USER ---
  router.get("/my-events", verifyFirebaseToken(admin), async (req, res) => {
    try {
      const userEmail = req.token_email;

      const eventsCollection = req.app.locals.client
        .db("my_community_forum_db")
        .collection("events");

      const userEvents = await eventsCollection
        .find({ creatorEmail: userEmail })
        .sort({ date: 1 })
        .toArray();

      if (userEvents.length === 0) {
        return res.send({
          message: "NO EVENTS FOUND FOR THIS USER",
          events: [],
        });
      }

      res.send(userEvents);
    } catch (err) {
      console.error("ERROR FETCHING USER EVENTS: ", err);
      res.status(500).send({ message: "FAILED TO FETCH USER EVENTS!" });
    }
  });

  // --- GET SINGLE EVENT BY ID ---
  router.get("/:id", async (req, res) => {
    try {
      const eventsCollection = req.app.locals.client
        .db("my_community_forum_db")
        .collection("events");

      const event = await eventsCollection.findOne({
        _id: new ObjectId(req.params.id),
      });

      if (!event) return res.status(404).send({ message: "EVENT NOT FOUND!" });

      res.send(event);
    } catch (err) {
      console.error("ERROR FETCHING EVENT: ", err);
      res.status(500).send({ message: "FAILED TO FETCH EVENT!" });
    }
  });

  // --- UPDATE EVENT BY ID ---
  router.patch("/:id", verifyFirebaseToken(admin), async (req, res) => {
    try {
      const updatedEvent = req.body;

      const eventsCollection = req.app.locals.client
        .db("my_community_forum_db")
        .collection("events");

      const result = await eventsCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: updatedEvent }
      );

      res.send(result);
    } catch (err) {
      console.error("ERROR UPDATING EVENT: ", err);
      res.status(500).send({ message: "FAILED TO UPDATE EVENT!" });
    }
  });

  // --- DELETE EVENT AND ITS JOINED RECORDS ---
  router.delete("/:id", verifyFirebaseToken(admin), async (req, res) => {
    try {
      const eventIdParam = req.params.id;
      const eventObjectId = new ObjectId(eventIdParam);

      const db = req.app.locals.client.db("my_community_forum_db");
      const eventsCollection = db.collection("events");
      const joinedEventsCollection = db.collection("joinedEvents");

      await joinedEventsCollection.deleteMany({
        $or: [{ eventId: eventObjectId }, { eventId: eventIdParam }],
      });

      const result = await eventsCollection.deleteOne({ _id: eventObjectId });

      if (result.deletedCount === 0) {
        return res.status(404).send({ message: "EVENT NOT FOUND!" });
      }

      res.send({
        message: "Event and all joined records deleted successfully",
      });
    } catch (err) {
      console.error("ERROR DELETING EVENT AND JOINS: ", err);
      res.status(500).send({ message: "FAILED TO DELETE EVENT!" });
    }
  });

  // --- RETURN ROUTER INSTANCE ---
  return router;
};
