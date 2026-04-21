// src/validators/brand.validator.js
const Joi = require('joi');

const createBrandSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  slug: Joi.string().min(2).max(100).lowercase().pattern(/^[a-z0-9-]+$/).required(),
  description: Joi.string().max(1000).optional(),
  logo: Joi.string().uri().optional(),
  website: Joi.string().uri().optional(),
  category: Joi.string().valid(
    'BEAUTY','FASHION','TECH','FOOD','SPORT',
    'HEALTH','HOME','TRAVEL','FINANCE','EDUCATION','OTHER'
  ).required(),
  legalName: Joi.string().max(200).optional(),
  vatNumber: Joi.string().max(50).optional(),
  country: Joi.string().max(100).optional(),
});

const updateBrandSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().max(1000).optional(),
  logo: Joi.string().uri().optional(),
  website: Joi.string().uri().optional(),
  category: Joi.string().valid(
    'BEAUTY','FASHION','TECH','FOOD','SPORT',
    'HEALTH','HOME','TRAVEL','FINANCE','EDUCATION','OTHER'
  ).optional(),
  legalName: Joi.string().max(200).optional(),
  vatNumber: Joi.string().max(50).optional(),
  country: Joi.string().max(100).optional(),
}).min(1);

const addProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).optional(),
  url: Joi.string().uri().optional(),
  imageUrl: Joi.string().uri().optional(),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(422).json({
      success: false,
      message: 'Validation échouée',
      errors: error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      })),
    });
  }
  next();
};

module.exports = {
  validateCreateBrand: validate(createBrandSchema),
  validateUpdateBrand: validate(updateBrandSchema),
  validateAddProduct: validate(addProductSchema),
};