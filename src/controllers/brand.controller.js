// src/controllers/brand.controller.js
const brandService = require('../services/brand.service');

const createBrand = async (req, res) => {
  try {
    const brand = await brandService.createBrand(req.user.id, req.body);
    return res.status(201).json({ success: true, data: { brand } });
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const getMyBrands = async (req, res) => {
  try {
    const brands = await brandService.getBrands(req.user.id);
    return res.status(200).json({ success: true, data: { brands } });
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const getBrandById = async (req, res) => {
  try {
    const brand = await brandService.getBrandById(req.params.id, req.user.id);
    return res.status(200).json({ success: true, data: { brand } });
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const updateBrand = async (req, res) => {
  try {
    const brand = await brandService.updateBrand(req.params.id, req.user.id, req.body);
    return res.status(200).json({ success: true, data: { brand } });
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const deleteBrand = async (req, res) => {
  try {
    await brandService.deleteBrand(req.params.id, req.user.id);
    return res.status(200).json({ success: true, message: 'Brand désactivée' });
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const product = await brandService.addProduct(req.params.id, req.user.id, req.body);
    return res.status(201).json({ success: true, data: { product } });
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await brandService.deleteProduct(req.params.id, req.params.productId, req.user.id);
    return res.status(200).json({ success: true, message: 'Produit supprimé' });
  } catch (err) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createBrand,
  getMyBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  addProduct,
  deleteProduct,
};