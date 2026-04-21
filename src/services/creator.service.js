// src/services/creator.service.js
const { prisma } = require('../config/database');

const createCreator = async (userId, data) => {
  const { username, bio, location, level, isAvailable, niches, platforms } = data;

  // Vérifier doublon userId
  const existing = await prisma.creator.findUnique({ where: { userId } });
  if (existing) throw { status: 409, message: 'Profil créateur déjà existant' };

  const creator = await prisma.creator.create({
    data: {
      userId,
      username,
      bio,
      location,
      level: level || 'NANO',
      isAvailable: isAvailable ?? true,
      niches: {
        create: niches.map((niche) => ({ niche })),
      },
      platforms: {
        create: platforms.map((p) => ({
          platform: p.platform,
          handle: p.handle,
          followers: p.followers || 0,
          avgViews: p.avgViews || 0,
          engagementRate: p.engagementRate || 0,
        })),
      },
      vetting: {
        create: { status: 'PENDING' },
      },
    },
    include: {
      niches: true,
      platforms: true,
      vetting: true,
    },
  });

  return creator;
};

const getCreatorById = async (id) => {
  const creator = await prisma.creator.findUnique({
    where: { id },
    include: {
      niches: true,
      platforms: true,
      portfolio: true,
      vetting: true,
    },
  });
  if (!creator) throw { status: 404, message: 'Créateur introuvable' };
  return creator;
};

const getCreatorByUserId = async (userId) => {
  const creator = await prisma.creator.findUnique({
    where: { userId },
    include: {
      niches: true,
      platforms: true,
      portfolio: true,
      vetting: true,
    },
  });
  if (!creator) throw { status: 404, message: 'Profil créateur introuvable' };
  return creator;
};

const updateCreator = async (userId, data) => {
  const creator = await prisma.creator.findUnique({ where: { userId } });
  if (!creator) throw { status: 404, message: 'Créateur introuvable' };

  return prisma.creator.update({
    where: { userId },
    data,
    include: { niches: true, platforms: true },
  });
};

const addPortfolioItem = async (userId, data) => {
  const creator = await prisma.creator.findUnique({ where: { userId } });
  if (!creator) throw { status: 404, message: 'Créateur introuvable' };

  return prisma.portfolioItem.create({
    data: { ...data, creatorId: creator.id },
  });
};

const deletePortfolioItem = async (userId, itemId) => {
  const creator = await prisma.creator.findUnique({ where: { userId } });
  if (!creator) throw { status: 404, message: 'Créateur introuvable' };

  const item = await prisma.portfolioItem.findFirst({
    where: { id: itemId, creatorId: creator.id },
  });
  if (!item) throw { status: 404, message: 'Item introuvable' };

  await prisma.portfolioItem.delete({ where: { id: itemId } });
};

const updateVetting = async (creatorId, reviewedBy, status, comment) => {
  const creator = await prisma.creator.findUnique({ where: { id: creatorId } });
  if (!creator) throw { status: 404, message: 'Créateur introuvable' };

  return prisma.vetting.update({
    where: { creatorId },
    data: {
      status,
      reviewedBy,
      comment,
      verifiedAt: status === 'APPROVED' ? new Date() : null,
    },
  });
};

module.exports = {
  createCreator,
  getCreatorById,
  getCreatorByUserId,
  updateCreator,
  addPortfolioItem,
  deletePortfolioItem,
  updateVetting,
};