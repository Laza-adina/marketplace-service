// src/services/search.service.js
const { prisma } = require('../config/database');

/**
 * Recherche filtrée de créateurs
 * Filtres : niche, platform, level, location, isAvailable, vettingStatus
 * Pagination : page, limit
 */
const searchCreators = async (filters = {}, pagination = {}) => {
  const {
    niche,
    platform,
    level,
    location,
    isAvailable,
    vettingStatus = 'APPROVED',
    minFollowers,
  } = filters;

  const page = parseInt(pagination.page) || 1;
  const limit = parseInt(pagination.limit) || 20;
  const skip = (page - 1) * limit;

  // Construction dynamique du where
  const where = {};

  if (level) where.level = level;
  if (location) where.location = { contains: location, mode: 'insensitive' };
  if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true';

  if (niche) {
    where.niches = { some: { niche } };
  }

  if (platform || minFollowers) {
    where.platforms = {
      some: {
        ...(platform && { platform }),
        ...(minFollowers && { followers: { gte: parseInt(minFollowers) } }),
      },
    };
  }

  if (vettingStatus) {
    where.vetting = { status: vettingStatus };
  }

  const [creators, total] = await Promise.all([
    prisma.creator.findMany({
      where,
      skip,
      take: limit,
      include: {
        niches: true,
        platforms: true,
        vetting: { select: { status: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.creator.count({ where }),
  ]);

  return {
    data: creators,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = { searchCreators };