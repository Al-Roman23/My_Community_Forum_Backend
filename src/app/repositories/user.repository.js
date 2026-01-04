// This File Handles User Database Operations
const { getCollection } = require("../../config/db");

class UserRepository {
  // Create New User In Database
  async createUser(user) {
    const usersCollection = await getCollection("users");
    return usersCollection.insertOne({ ...user, createdAt: new Date() });
  }

  // Find User By Email
  async findByEmail(email) {
    const usersCollection = await getCollection("users");
    return usersCollection.findOne({ email });
  }

  // Find User By ID
  async findById(id) {
    const usersCollection = await getCollection("users");
    const { ObjectId } = require("mongodb");
    return usersCollection.findOne({ _id: new ObjectId(id) });
  }

  // Get All Users
  async findAll() {
    const usersCollection = await getCollection("users");
    return usersCollection.find().toArray();
  }

  // Update User By Email
  async updateByEmail(email, updateData) {
    const usersCollection = await getCollection("users");
    return usersCollection.updateOne({ email }, { $set: updateData });
  }

  // Delete User By Email
  async deleteByEmail(email) {
    const usersCollection = await getCollection("users");
    return usersCollection.deleteOne({ email });
  }
}

module.exports = new UserRepository();
