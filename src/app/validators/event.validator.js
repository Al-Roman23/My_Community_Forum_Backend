// This File Validates Event Input
function validateCreateEvent(data) {
  const {
    title,
    description,
    eventType,
    thumbnail,
    location,
    date,
    creatorEmail,
  } = data;

  // Check Required Fields
  if (
    !title ||
    !description ||
    !eventType ||
    !thumbnail ||
    !location ||
    !date ||
    !creatorEmail
  ) {
    return {
      valid: false,
      message: "ALL FIELDS ARE REQUIRED!",
    };
  }

  // Validate Date
  const eventDate = new Date(date);
  if (isNaN(eventDate.getTime())) {
    return { valid: false, message: "INVALID EVENT DATE!" };
  }

  if (eventDate < new Date()) {
    return { valid: false, message: "EVENT DATE MUST BE IN THE FUTURE!" };
  }

  // Return Valid If All Checks Pass
  return { valid: true };
}

module.exports = { validateCreateEvent };
