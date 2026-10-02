// keep in sync with the Joi schemas on the backend
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateName = (name) => {
  if (!name || !name.trim()) return 'Name is required';
  if (name.length < 20) return 'Name must be at least 20 characters';
  if (name.length > 60) return 'Name must be at most 60 characters';
  return '';
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!EMAIL_REGEX.test(email)) return 'Invalid email format';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (!PASSWORD_REGEX.test(password)) {
    return 'Password must be 8-16 chars with at least one uppercase and one special character';
  }
  return '';
};

export const validateAddress = (address) => {
  if (address && address.length > 400) return 'Address must be at most 400 characters';
  return '';
};

export const validateRating = (rating) => {
  const n = parseInt(rating, 10);
  if (isNaN(n) || n < 1 || n > 5) return 'Rating must be between 1 and 5';
  return '';
};

const fieldValidators = {
  name: validateName,
  email: validateEmail,
  password: validatePassword,
  address: validateAddress,
};

// returns { field: message } for the fields present in `fields`
export const validateForm = (fields) => {
  const errors = {};
  Object.keys(fieldValidators).forEach((key) => {
    if (key in fields) {
      const message = fieldValidators[key](fields[key]);
      if (message) errors[key] = message;
    }
  });
  return errors;
};
