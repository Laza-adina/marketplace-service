// src/routes/matching.routes.js
const router = require('express').Router();
const { matchCreators } = require('../controllers/matching.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

// POST /matching — réservé aux agences
router.post('/', authenticate, requireRole('AGENCY'), matchCreators);

module.exports = router;