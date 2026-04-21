// src/validators/creator.validator.js
const Joi = require('joi');

const createCreatorSchema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  bio: Joi.string().max(500).optional(),
  location: Joi.string().max(100).optional(),
  level: Joi.string().valid('NANO', 'MICRO', 'MACRO', 'MEGA').optional(),
  isAvailable: Joi.boolean().optional(),
  niches: Joi.array()
    .items(Joi.string().valid(
      'BEAUTY','FASHION','TECH','FOOD','TRAVEL',
      'FITNESS','GAMING','LIFESTYLE','PARENTING',
      'FINANCE','EDUCATION','OTHER'
    ))
    .min(1)
    .required(),
  platforms: Joi.array().items(
    Joi.object({
      platform: Joi.string()
        .valid('TIKTOK','INSTAGRAM','YOUTUBE','TWITTER','LINKEDIN','PINTEREST')
        .required(),
      handle: Joi.string().required(),
      followers: Joi.number().integer().min(0).optional(),
      avgViews: Joi.number().integer().min(0).optional(),
      engagementRate: Joi.number().min(0).max(100).optional(),
    })
  ).min(1).required(),
});

const updateCreatorSchema = Joi.object({
  bio: Joi.string().max(500).optional(),
  location: Joi.string().max(100).optional(),
  level: Joi.string().valid('NANO', 'MICRO', 'MACRO', 'MEGA').optional(),
  isAvailable: Joi.boolean().optional(),
}).min(1);

const addPortfolioSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  url: Joi.string().uri().required(),
  thumbnail: Joi.string().uri().optional(),
  platform: Joi.string()
    .valid('TIKTOK','INSTAGRAM','YOUTUBE','TWITTER','LINKEDIN','PINTEREST')
    .optional(),
  views: Joi.number().integer().min(0).optional(),
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
  validateCreateCreator: validate(createCreatorSchema),
  validateUpdateCreator: validate(updateCreatorSchema),
  validateAddPortfolio: validate(addPortfolioSchema),
};