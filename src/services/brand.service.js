// src/services/brand.service.js
const { prisma } = require('../config/database');

const createBrand = async (agencyUserId, data) => {
  const existing = await prisma.brand.findUnique({ where: { slug: data.slug } });
  if (existing) throw { status: 409, message: 'Ce slug est déjà utilisé' };

  return prisma.brand.create({
    data: { ...data, agencyUserId },
    include: { products: true },
  });
};

const getBrands = async (agencyUserId) => {
  return prisma.brand.findMany({
    where: { agencyUserId, isActive: true },
    include: { products: true },
    orderBy: { createdAt: 'desc' },
  });
};

const getBrandById = async (id, agencyUserId) => {
  const brand = await prisma.brand.findFirst({
    where: { id, agencyUserId },
    include: { products: true },
  });
  if (!brand) throw { status: 404, message: 'Brand introuvable' };
  return brand;
};

const updateBrand = async (id, agencyUserId, data) => {
  const brand = await prisma.brand.findFirst({ where: { id, agencyUserId } });
  if (!brand) throw { status: 404, message: 'Brand introuvable' };

  return prisma.brand.update({
    where: { id },
    data,
    include: { products: true },
  });
};

const deleteBrand = async (id, agencyUserId) => {
  const brand = await prisma.brand.findFirst({ where: { id, agencyUserId } });
  if (!brand) throw { status: 404, message: 'Brand introuvable' };

  return prisma.brand.update({
    where: { id },
    data: { isActive: false },
  });
};

const addProduct = async (brandId, agencyUserId, data) => {
  const brand = await prisma.brand.findFirst({ where: { id: brandId, agencyUserId } });
  if (!brand) throw { status: 404, message: 'Brand introuvable' };

  return prisma.brandProduct.create({
    data: { ...data, brandId },
  });
};

const deleteProduct = async (brandId, productId, agencyUserId) => {
  const brand = await prisma.brand.findFirst({ where: { id: brandId, agencyUserId } });
  if (!brand) throw { status: 404, message: 'Brand introuvable' };

  const product = await prisma.brandProduct.findFirst({
    where: { id: productId, brandId },
  });
  if (!product) throw { status: 404, message: 'Produit introuvable' };

  await prisma.brandProduct.delete({ where: { id: productId } });
};

module.exports = {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  addProduct,
  deleteProduct,
};