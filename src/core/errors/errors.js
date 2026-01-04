// This File Defines Custom API Error Classes For Centralized Error Handling
class ApiError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

class Unauthorized extends ApiError {
  constructor(msg) {
    super(msg, 401);
  }
}
class NotFound extends ApiError {
  constructor(msg) {
    super(msg, 404);
  }
}
class Forbidden extends ApiError {
  constructor(msg) {
    super(msg, 403);
  }
}
class Conflict extends ApiError {
  constructor(msg) {
    super(msg, 409);
  }
}
class BadRequest extends ApiError {
  constructor(msg) {
    super(msg, 400);
  }
}
class InternalError extends ApiError {
  constructor(msg) {
    super(msg, 500);
  }
}

module.exports = {
  ApiError,
  Unauthorized,
  NotFound,
  Forbidden,
  Conflict,
  BadRequest,
  InternalError,
};
