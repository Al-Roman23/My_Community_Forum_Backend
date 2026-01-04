// This File Handles User Business Logic
const UserRepository = require("../repositories/user.repository");
const { Conflict, NotFound } = require("../../core/errors/errors");

class UserService {
  // Register New User
  async registerUser(user) {
    const existingUser = await UserRepository.findByEmail(user.email);
    if (existingUser) throw new Conflict("User Already Exists!");
    return UserRepository.createUser(user);
  }

  // Get User By Email
  async getUserByEmail(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new NotFound("User Not Found!");
    return user;
  }

  // Get All Users
  async getAllUsers() {
    return UserRepository.findAll();
  }

  // Update User
  async updateUser(email, updateData) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new NotFound("User Not Found!");
    return UserRepository.updateByEmail(email, updateData);
  }

  // Delete User
  async deleteUser(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new NotFound("User Not Found!");
    return UserRepository.deleteByEmail(email);
  }
}

module.exports = new UserService();
