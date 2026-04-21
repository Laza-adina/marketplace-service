// src/routes/brand.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/brand.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const {
  validateCreateBrand,
  validateUpdateBrand,
  validateAddProduct,
} = require('../validators/brand.validator');

router.post('/', authenticate, requireRole('AGENCY'), validateCreateBrand, ctrl.createBrand);
router.get('/', authenticate, requireRole('AGENCY'), ctrl.getMyBrands);
router.get('/:id', authenticate, requireRole('AGENCY'), ctrl.getBrandById);
router.patch('/:id', authenticate, requireRole('AGENCY'), validateUpdateBrand, ctrl.updateBrand);
router.delete('/:id', authenticate, requireRole('AGENCY'), ctrl.deleteBrand);

// Produits
router.post('/:id/products', authenticate, requireRole('AGENCY'), validateAddProduct, ctrl.addProduct);
router.delete('/:id/products/:productId', authenticate, requireRole('AGENCY'), ctrl.deleteProduct);

module.exports = router;