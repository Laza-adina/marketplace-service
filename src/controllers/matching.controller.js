// src/controllers/matching.controller.js
const matchingService = require('../services/matching.service');

const matchCreators = async (req, res) => {
  try {
    const { niches, platforms, level, location } = req.body;

    if (!niches && !platforms && !level && !location) {
      return res.status(400).json({
        success: false,
        message: 'Au moins un critère de matching requis',
      });
    }

    const results = await matchingService.matchCreators({
      niches,
      platforms,
      level,
      location,
    });

    return res.status(200).json({
      success: true,
      data: { results, total: results.length },
    });
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

module.exports = { matchCreators };