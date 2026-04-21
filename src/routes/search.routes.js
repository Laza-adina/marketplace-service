// src/routes/search.routes.js
const router = require('express').Router();
const { searchCreators } = require('../controllers/search.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// GET /search/creators?niche=BEAUTY&platform=INSTAGRAM&level=MICRO&location=Paris&page=1&limit=20
router.get('/creators', authenticate, searchCreators);

module.exports = router;