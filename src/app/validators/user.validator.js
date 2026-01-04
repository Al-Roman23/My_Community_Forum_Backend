// This File Validates User Input
function validateRegisterUser(data) {
  const { name, email, role } = data;

  // Check Required Fields
  if (!name || !email) {
    return {
      valid: false,
      message: "NAME AND EMAIL REQUIRED!",
    };
  }

  // Validate Email Format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Invalid Email Format!" };
  }

  // Validate Role (Optional)
  if (role && !["user", "admin"].includes(role)) {
    return { valid: false, message: "Role Must Be User Or Admin!" };
  }

  // Return Valid If All Checks Pass
  return { valid: true };
}

module.exports = { validateRegisterUser };
