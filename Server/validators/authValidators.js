//Regex Codes
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const nameRegex = /^[a-zA-Z\s]{2,50}$/;

const validateRegister = (data) => {
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

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateLogin = (data) => {
  const errors = [];

  if (!data.email || !emailRegex.test(data.email)) {
    errors.push("Please provide a valid email address");
  }

  if (!data.password) {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateRegister,
  validateLogin,
  emailRegex,
  passwordRegex,
  nameRegex,
};
