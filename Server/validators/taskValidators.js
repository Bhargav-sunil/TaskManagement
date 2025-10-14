//Regex Codes
const titleRegex = /^[a-zA-Z0-9\s\-\.,]{2,100}$/;

const priorityRegex = /^(low|medium|high)$/;

const statusRegex = /^(pending|in progress|completed)$/;

const validateTaskCreate = (data) => {
  const errors = [];

  if (!data.title || !titleRegex.test(data.title)) {
    errors.push(
      "Title must be 2-100 characters and contain only letters, numbers, spaces, and basic punctuation"
    );
  }

  if (data.description && data.description.length > 500) {
    errors.push("Description must not exceed 500 characters");
  }

  if (data.priority && !priorityRegex.test(data.priority)) {
    errors.push("Priority must be low, medium, or high");
  }

  if (data.status && !statusRegex.test(data.status)) {
    errors.push("Status must be pending, in progress, or completed");
  }

  if (data.due_date) {
    const dueDate = new Date(data.due_date);
    if (isNaN(dueDate.getTime())) {
      errors.push("Due date must be a valid date");
    } else if (dueDate < new Date()) {
      errors.push("Due date cannot be in the past");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateTaskUpdate = (data) => {
  const errors = [];

  if (data.title && !titleRegex.test(data.title)) {
    errors.push(
      "Title must be 2-100 characters and contain only letters, numbers, spaces, and basic punctuation"
    );
  }

  if (data.description && data.description.length > 500) {
    errors.push("Description must not exceed 500 characters");
  }

  if (data.priority && !priorityRegex.test(data.priority)) {
    errors.push("Priority must be low, medium, or high");
  }

  if (data.status && !statusRegex.test(data.status)) {
    errors.push("Status must be pending, in progress, or completed");
  }

  if (data.due_date) {
    const dueDate = new Date(data.due_date);
    if (isNaN(dueDate.getTime())) {
      errors.push("Due date must be a valid date");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateTaskCreate,
  validateTaskUpdate,
};
