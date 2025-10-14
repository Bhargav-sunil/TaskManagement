const { emailRegex, passwordRegex, nameRegex } = require("./authValidators");

const validateUserCreate = (data) => {
  const errors = [];

  if (!data.name || !nameRegex.test(data.name)) {
    errors.push("Name must contain only letters and spaces (2-50 characters)");
  }

  if (!data.email || !emailRegex.test(data.email)) {
    errors.push("Please provide a valid email address");
  }

  if (!data.password || !passwordRegex.test(data.password)) {
    errors.push(
      "Password must be at least 8 characters with uppercase, lowercase, number and special character"
    );
  }

  if (data.role && !["user", "admin"].includes(data.role)) {
    errors.push("Role must be either user or admin");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateUserUpdate = (data) => {
  const errors = [];

  if (data.name && !nameRegex.test(data.name)) {
    errors.push("Name must contain only letters and spaces (2-50 characters)");
  }

  if (data.email && !emailRegex.test(data.email)) {
    errors.push("Please provide a valid email address");
  }

  if (data.role && !["user", "admin"].includes(data.role)) {
    errors.push("Role must be either user or admin");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateUserCreate,
  validateUserUpdate,
};
