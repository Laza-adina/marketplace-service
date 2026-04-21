// src/routes/index.js
const router = require('express').Router();

router.use('/creators', require('./creator.routes'));
router.use('/brands', require('./brand.routes'));
router.use('/search', require('./search.routes'));
router.use('/matching', require('./matching.routes'));

module.exports = router;