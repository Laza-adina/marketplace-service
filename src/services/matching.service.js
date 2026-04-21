// src/services/matching.service.js
const { prisma } = require('../config/database');

/**
 * Matching simple basé sur : niche + platform + level + location
 * Retourne les créateurs scorés par pertinence
 * Score : chaque critère correspondant = +1 point
 */
const matchCreators = async (criteria) => {
  const { niches = [], platforms = [], level, location } = criteria;

  // Récupérer tous les créateurs approuvés
  const creators = await prisma.creator.findMany({
    where: {
      vetting: { status: 'APPROVED' },
      isAvailable: true,
    },
    include: {
      niches: true,
      platforms: true,
      vetting: { select: { status: true } },
    },
  });

  // Scoring
  const scored = creators.map((creator) => {
    let score = 0;

    // +1 par niche correspondante
    const creatorNiches = creator.niches.map((n) => n.niche);
    niches.forEach((n) => {
      if (creatorNiches.includes(n)) score += 1;
    });

    // +1 par platform correspondante
    const creatorPlatforms = creator.platforms.map((p) => p.platform);
    platforms.forEach((p) => {
      if (creatorPlatforms.includes(p)) score += 1;
    });

    // +1 si level correspond
    if (level && creator.level === level) score += 1;

    // +1 si location correspond (partielle)
    if (
      location &&
      creator.location &&
      creator.location.toLowerCase().includes(location.toLowerCase())
    ) {
      score += 1;
    }

    return { ...creator, score };
  });

  // Filtrer score > 0, trier par score décroissant
  return scored
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20); // Top 20 résultats
};

module.exports = { matchCreators };