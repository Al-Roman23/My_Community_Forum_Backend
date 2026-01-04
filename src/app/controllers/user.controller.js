// This File Handles User Request And Response
const UserService = require("../services/user.service");
const { BadRequest, Forbidden } = require("../../core/errors/errors");
const { validateRegisterUser } = require("../validators/user.validator");

class UserController {
  // Route To Register New User
  async createUser(req, res, next) {
    try {
      const { name, email, photoURL, role } = req.body;

      // Validate User Input
      const validation = validateRegisterUser({ name, email, role: role || "user" });
      if (!validation.valid) throw new BadRequest(validation.message);

      // Prepare New User Object
      const newUser = {
        name,
        email,
        photoURL: photoURL || "",
        role: role || "user",
        createdAt: new Date(),
      };

      // Register User Using Service
      const result = await UserService.registerUser(newUser);

      res.status(201).json({
        message: "USER CREATED SUCCESSFULLY!",
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get All Users (Admin Only)
  async getAllUsers(req, res, next) {
    try {
      const requestingUser = await UserService.getUserByEmail(req.user.email);
      if (requestingUser.role !== "admin") {
        throw new Forbidden("FORBIDDEN: ADMIN ONLY");
      }

      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  // Get User By Email
  async getUserByEmail(req, res, next) {
    try {
      const user = await UserService.getUserByEmail(req.params.email);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  // Update User
  async updateUser(req, res, next) {
    try {
      const targetEmail = req.params.email;

      // Check if user is updating their own account
      if (targetEmail !== req.user.email) {
        throw new Forbidden("FORBIDDEN: NOT YOUR ACCOUNT");
      }

      const updatedData = req.body;
      const result = await UserService.updateUser(targetEmail, updatedData);

      res.json({
        message: "USER UPDATED SUCCESSFULLY!",
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete User
  async deleteUser(req, res, next) {
    try {
      const targetEmail = req.params.email;

      // Check if user is deleting their own account
      if (targetEmail !== req.user.email) {
        throw new Forbidden("FORBIDDEN: NOT YOUR ACCOUNT");
      }

      const result = await UserService.deleteUser(targetEmail);

      res.json({
        message: "USER DELETED SUCCESSFULLY!",
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get Current User (Me)
  async getMe(req, res, next) {
    try {
      const user = await UserService.getUserByEmail(req.user.email);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
