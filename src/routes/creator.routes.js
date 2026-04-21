// src/routes/creator.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/creator.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const {
  validateCreateCreator,
  validateUpdateCreator,
  validateAddPortfolio,
} = require('../validators/creator.validator');

// Profil créateur
router.post('/', authenticate, requireRole('CREATOR'), validateCreateCreator, ctrl.createCreator);
router.get('/me', authenticate, requireRole('CREATOR'), ctrl.getMyProfile);
router.patch('/me', authenticate, requireRole('CREATOR'), validateUpdateCreator, ctrl.updateMyProfile);
router.get('/:id', authenticate, ctrl.getCreatorById);

// Portfolio
router.post('/me/portfolio', authenticate, requireRole('CREATOR'), validateAddPortfolio, ctrl.addPortfolioItem);
router.delete('/me/portfolio/:itemId', authenticate, requireRole('CREATOR'), ctrl.deletePortfolioItem);

// Vetting — réservé aux agences
router.patch('/:id/vetting', authenticate, requireRole('AGENCY'), ctrl.updateVetting);

module.exports = router;