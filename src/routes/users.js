// --- MODULE IMPORTS ---
const express = require("express");
const router = express.Router();

// --- ROUTER EXPORT FUNCTION ---
module.exports = (client, admin) => {
  // --- FIREBASE TOKEN VERIFICATION MIDDLEWARE ---
  const verifyFirebaseToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).send({ message: "UNAUTHORIZED ACCESS!" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).send({ message: "UNAUTHORIZED ACCESS!" });

    try {
      const decodedUser = await admin.auth().verifyIdToken(token);
      req.token_email = decodedUser.email;
      next();
    } catch (err) {
      console.error("FIREBASE VERIFICATION FAILED: ", err);
      return res.status(401).send({ message: "UNAUTHORIZED ACCESS!" });
    }
  };

  // --- CREATE NEW USER ---
  router.post("/", async (req, res) => {
    try {
      const { name, email, photoURL, role = "user" } = req.body;

      if (!email || !name)
        return res.status(400).send({ message: "NAME AND EMAIL REQUIRED!" });

      const usersCollection = client
        .db("my_community_forum_db")
        .collection("users");

      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) return res.send({ message: "USER ALREADY EXISTS!" });

      const newUser = { name, email, photoURL, role, createdAt: new Date() };
      const result = await usersCollection.insertOne(newUser);

      res.send({ message: "USER CREATED SUCCESSFULLY!", result });
    } catch (err) {
      console.error("ERROR CREATING USER: ", err);
      res.status(500).send({ message: "FAILED TO CREATE USER!" });
    }
  });

  // --- GET ALL USERS (ADMIN ONLY) ---
  router.get("/", verifyFirebaseToken, async (req, res) => {
    try {
      const usersCollection = client
        .db("my_community_forum_db")
        .collection("users");

      const requestingUser = await usersCollection.findOne({
        email: req.token_email,
      });
      if (!requestingUser || requestingUser.role !== "admin") {
        return res.status(403).send({ message: "FORBIDDEN: ADMIN ONLY" });
      }

      const users = await usersCollection.find().toArray();
      res.send(users);
    } catch (err) {
      console.error("ERROR FETCHING USERS: ", err);
      res.status(500).send({ message: "FAILED TO FETCH USERS!" });
    }
  });

  // --- GET USER BY EMAIL ---
  router.get("/:email", async (req, res) => {
    try {
      const usersCollection = client
        .db("my_community_forum_db")
        .collection("users");

      const user = await usersCollection.findOne({ email: req.params.email });
      if (!user) return res.status(404).send({ message: "USER NOT FOUND!" });

      res.send(user);
    } catch (err) {
      console.error("ERROR FETCHING USER: ", err);
      res.status(500).send({ message: "FAILED TO FETCH USER!" });
    }
  });

  // --- UPDATE USER ---
  router.patch("/:email", verifyFirebaseToken, async (req, res) => {
    try {
      const updatedData = req.body;
      const targetEmail = req.params.email;

      if (targetEmail !== req.token_email) {
        return res.status(403).send({ message: "FORBIDDEN: NOT YOUR ACCOUNT" });
      }

      const usersCollection = client
        .db("my_community_forum_db")
        .collection("users");

      const result = await usersCollection.updateOne(
        { email: targetEmail },
        { $set: updatedData }
      );

      res.send({ message: "USER UPDATED SUCCESSFULLY!", result });
    } catch (err) {
      console.error("ERROR UPDATING USER: ", err);
      res.status(500).send({ message: "FAILED TO UPDATE USER!" });
    }
  });

  // --- DELETE USER ---
  router.delete("/:email", verifyFirebaseToken, async (req, res) => {
    try {
      const targetEmail = req.params.email;

      if (targetEmail !== req.token_email) {
        return res.status(403).send({ message: "FORBIDDEN: NOT YOUR ACCOUNT" });
      }

      const usersCollection = client
        .db("my_community_forum_db")
        .collection("users");

      const result = await usersCollection.deleteOne({ email: targetEmail });

      res.send({ message: "USER DELETED SUCCESSFULLY!", result });
    } catch (err) {
      console.error("ERROR DELETING USER: ", err);
      res.status(500).send({ message: "FAILED TO DELETE USER!" });
    }
  });

  // --- RETURN ROUTER INSTANCE ---
  return router;
};
