// This File Handles Auth Request And Response
const jwt = require("jsonwebtoken");
const UserService = require("../services/user.service");

const JWT_SECRET = process.env.JWT_SECRET || "development_secret";

class AuthController {
  // Generate JWT Token
  generateJWT(user) {
    const payload = { email: user.email, role: user.role || "user" };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "5h" });
  }

  // Issue JWT Token
  async getToken(req, res, next) {
    try {
      const user = await UserService.getUserByEmail(req.user.email);
      const token = this.generateJWT(user);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  // Verify Firebase Token
  async verifyToken(req, res, next) {
    try {
      res.json({
        message: "TOKEN VERIFIED SUCCESSFULLY",
        email: req.user.email,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();

