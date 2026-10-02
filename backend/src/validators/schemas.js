const Joi = require('joi');

const passwordPattern = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

const nameRule = Joi.string().min(20).max(60).required().messages({
  'string.empty': 'Name is required',
  'string.min': 'Name must be at least 20 characters',
  'string.max': 'Name must be at most 60 characters',
});

const emailRule = Joi.string().email().max(255).required();

const passwordRule = Joi.string().pattern(passwordPattern).required().messages({
  'string.pattern.base': 'Password must be 8-16 chars with at least one uppercase and one special character',
});

const addressRule = Joi.string().max(400).allow('', null);

const registerSchema = Joi.object({
  name: nameRule,
  email: emailRule,
  password: passwordRule,
  address: addressRule,
});

const loginSchema = Joi.object({
  email: emailRule,
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: passwordRule,
});

const addUserSchema = Joi.object({
  name: nameRule,
  email: emailRule,
  password: passwordRule,
  address: addressRule,
  role: Joi.string().valid('admin', 'user', 'owner').required(),
});

const addStoreSchema = Joi.object({
  name: nameRule,
  email: emailRule,
  address: addressRule,
  ownerId: Joi.number().integer().required(),
});

const ratingSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  addUserSchema,
  addStoreSchema,
  ratingSchema,
};
