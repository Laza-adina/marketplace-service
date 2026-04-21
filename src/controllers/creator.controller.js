// src/controllers/creator.controller.js
const creatorService = require('../services/creator.service');

const createCreator = async (req, res) => {
  try {
    const creator = await creatorService.createCreator(req.user.id, req.body);
    return res.status(201).json({ success: true, data: { creator } });
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const creator = await creatorService.getCreatorByUserId(req.user.id);
    return res.status(200).json({ success: true, data: { creator } });
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const getCreatorById = async (req, res) => {
  try {
    const creator = await creatorService.getCreatorById(req.params.id);
    return res.status(200).json({ success: true, data: { creator } });
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const creator = await creatorService.updateCreator(req.user.id, req.body);
    return res.status(200).json({ success: true, data: { creator } });
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const addPortfolioItem = async (req, res) => {
  try {
    const item = await creatorService.addPortfolioItem(req.user.id, req.body);
    return res.status(201).json({ success: true, data: { item } });
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const deletePortfolioItem = async (req, res) => {
  try {
    await creatorService.deletePortfolioItem(req.user.id, req.params.itemId);
    return res.status(200).json({ success: true, message: 'Item supprimé' });
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const updateVetting = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const vetting = await creatorService.updateVetting(
      req.params.id,
      req.user.id,
      status,
      comment
    );
    return res.status(200).json({ success: true, data: { vetting } });
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createCreator,
  getMyProfile,
  getCreatorById,
  updateMyProfile,
  addPortfolioItem,
  deletePortfolioItem,
  updateVetting,
};