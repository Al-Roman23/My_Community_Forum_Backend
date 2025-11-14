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
  // --- ATTACH ADMIN AND CLIENT TO REQUEST ---
  router.use((req, res, next) => {
    req.admin = admin;
    req.app.locals.client = client;
    next();
  });

  // --- CREATE MIDDLEWARE INSTANCE WITH ADMIN ---
  const verifyToken = verifyFirebaseToken(admin);

  // --- JOIN AN EVENT ---
  router.post("/", verifyToken, async (req, res) => {
    try {
      const { eventId } = req.body;
      const userEmail = req.token_email;

      if (!eventId)
        return res.status(400).send({ message: "EVENT ID REQUIRED!" });

      const db = req.app.locals.client.db("my_community_forum_db");
      const joinedEventsCollection = db.collection("joinedEvents");
      const eventsCollection = db.collection("events");

      // --- CHECK IF USER ALREADY JOINED ---
      const existingJoin = await joinedEventsCollection.findOne({
        eventId,
        userEmail,
      });
      if (existingJoin)
        return res.send({ message: "ALREADY JOINED THIS EVENT!" });

      // --- CHECK IF EVENT EXISTS ---
      const eventExists = await eventsCollection.findOne({
        _id: new ObjectId(eventId),
      });
      if (!eventExists)
        return res.status(404).send({ message: "EVENT DOES NOT EXIST!" });

      // --- INSERT JOIN RECORD ---
      const joinEntry = { eventId, userEmail, joinedAt: new Date() };
      const result = await joinedEventsCollection.insertOne(joinEntry);

      res.send({ message: "JOINED EVENT SUCCESSFULLY!", result });
    } catch (err) {
      console.error("ERROR JOINING EVENT:", err);
      res.status(500).send({ message: "FAILED TO JOIN EVENT!" });
    }
  });

  // --- GET JOINED EVENTS BY EMAIL ---
  router.get("/", async (req, res) => {
    try {
      const userEmail = req.query.email;
      if (!userEmail)
        return res.status(400).send({ message: "EMAIL QUERY REQUIRED!" });

      const joinedEventsCollection = req.app.locals.client
        .db("my_community_forum_db")
        .collection("joinedEvents");

      const joinedEvents = await joinedEventsCollection
        .find({ userEmail })
        .sort({ joinedAt: -1 })
        .toArray();

      res.send(joinedEvents);
    } catch (err) {
      console.error("ERROR FETCHING JOINED EVENTS: ", err);
      res.status(500).send({ message: "FAILED TO FETCH JOINED EVENTS!" });
    }
  });

  // --- GET FULL EVENT DETAILS FOR MY JOINED EVENTS ---
  router.get("/my-joined", verifyToken, async (req, res) => {
    try {
      const userEmail = req.token_email;

      const db = req.app.locals.client.db("my_community_forum_db");
      const joinedEventsCollection = db.collection("joinedEvents");
      const eventsCollection = db.collection("events");

      const joinedEvents = await joinedEventsCollection
        .find({ userEmail })
        .sort({ joinedAt: -1 })
        .toArray();

      if (joinedEvents.length === 0)
        return res.send({ message: "NO JOINED EVENTS FOUND", events: [] });

      const eventIds = joinedEvents.map((e) => new ObjectId(e.eventId));
      const events = await eventsCollection
        .find({ _id: { $in: eventIds } })
        .sort({ date: 1 })
        .toArray();

      res.send(events);
    } catch (err) {
      console.error("ERROR FETCHING FULL JOINED EVENTS: ", err);
      res.status(500).send({ message: "FAILED TO FETCH JOINED EVENTS!" });
    }
  });

  // --- LEAVE AN EVENT ---
  router.delete("/:id", verifyToken, async (req, res) => {
    try {
      const db = req.app.locals.client.db("my_community_forum_db");
      const joinedEventsCollection = db.collection("joinedEvents");

      const result = await joinedEventsCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });

      if (result.deletedCount === 0)
        return res.status(404).send({ message: "JOINED EVENT NOT FOUND!" });

      res.send({ message: "LEFT EVENT SUCCESSFULLY!", result });
    } catch (err) {
      console.error("ERROR LEAVING EVENT:", err);
      res.status(500).send({ message: "FAILED TO LEAVE EVENT!" });
    }
  });

  // --- RETURN ROUTER INSTANCE ---
  return router;
};
