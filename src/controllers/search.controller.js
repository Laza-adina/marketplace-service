// src/controllers/search.controller.js
const searchService = require('../services/search.service');

const searchCreators = async (req, res) => {
  try {
    const filters = {
      niche: req.query.niche,
      platform: req.query.platform,
      level: req.query.level,
      location: req.query.location,
      isAvailable: req.query.isAvailable,
      minFollowers: req.query.minFollowers,
      vettingStatus: req.query.vettingStatus,
    };

    const pagination = {
      page: req.query.page,
      limit: req.query.limit,
    };

    const result = await searchService.searchCreators(filters, pagination);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

module.exports = { searchCreators };