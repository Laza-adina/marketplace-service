// src/config/swagger.js
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UGC Platform — Marketplace Service',
      version: '1.0.0',
      description: 'Microservice Marketplace — Créateurs, Brands, Sourcing & Matching',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 3002}` }],
    components: {
      securitySchemes: {
        BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Creator: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string' },
            username: { type: 'string', example: 'lucas_ugc' },
            bio: { type: 'string' },
            location: { type: 'string', example: 'Paris, France' },
            level: { type: 'string', enum: ['NANO', 'MICRO', 'MACRO', 'MEGA'] },
            isAvailable: { type: 'boolean' },
            niches: { type: 'array', items: { type: 'object' } },
            platforms: { type: 'array', items: { type: 'object' } },
          },
        },
        Brand: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Nike France' },
            slug: { type: 'string', example: 'nike-france' },
            category: { type: 'string', example: 'SPORT' },
            description: { type: 'string' },
            logo: { type: 'string', format: 'uri' },
            website: { type: 'string', format: 'uri' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
    tags: [
      { name: 'Creators', description: 'Profils créateurs / influenceurs' },
      { name: 'Brands', description: 'Profils marques gérés par les agences' },
      { name: 'Search', description: 'Recherche filtrée de créateurs' },
      { name: 'Matching', description: 'Matching créateurs ↔ critères' },
    ],
    paths: {

      // ─────────────────────────────────────────
      // CREATORS
      // ─────────────────────────────────────────
      '/api/v1/creators': {
        post: {
          tags: ['Creators'],
          summary: 'Créer un profil créateur',
          description: 'Réservé au rôle CREATOR',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'niches', 'platforms'],
                  properties: {
                    username: { type: 'string', example: 'lucas_ugc' },
                    bio: { type: 'string', example: 'Créateur UGC lifestyle & tech' },
                    location: { type: 'string', example: 'Paris, France' },
                    level: { type: 'string', enum: ['NANO', 'MICRO', 'MACRO', 'MEGA'] },
                    isAvailable: { type: 'boolean', example: true },
                    niches: {
                      type: 'array',
                      items: { type: 'string', enum: ['BEAUTY','FASHION','TECH','FOOD','TRAVEL','FITNESS','GAMING','LIFESTYLE','PARENTING','FINANCE','EDUCATION','OTHER'] },
                      example: ['TECH', 'LIFESTYLE'],
                    },
                    platforms: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          platform: { type: 'string', enum: ['TIKTOK','INSTAGRAM','YOUTUBE','TWITTER','LINKEDIN','PINTEREST'] },
                          handle: { type: 'string' },
                          followers: { type: 'integer' },
                          avgViews: { type: 'integer' },
                          engagementRate: { type: 'number' },
                        },
                      },
                      example: [{ platform: 'INSTAGRAM', handle: '@lucas_ugc', followers: 25000, avgViews: 5000, engagementRate: 4.2 }],
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Profil créé' },
            409: { description: 'Profil déjà existant' },
            422: { description: 'Validation échouée' },
          },
        },
      },

      '/api/v1/creators/me': {
        get: {
          tags: ['Creators'],
          summary: 'Récupérer mon profil créateur',
          responses: {
            200: { description: 'Profil retourné' },
            404: { description: 'Profil introuvable' },
          },
        },
        patch: {
          tags: ['Creators'],
          summary: 'Mettre à jour mon profil créateur',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    bio: { type: 'string' },
                    location: { type: 'string' },
                    level: { type: 'string', enum: ['NANO', 'MICRO', 'MACRO', 'MEGA'] },
                    isAvailable: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Profil mis à jour' },
          },
        },
      },

      '/api/v1/creators/{id}': {
        get: {
          tags: ['Creators'],
          summary: 'Récupérer un créateur par ID',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: {
            200: { description: 'Créateur retourné' },
            404: { description: 'Introuvable' },
          },
        },
      },

      '/api/v1/creators/{id}/vetting': {
        patch: {
          tags: ['Creators'],
          summary: 'Mettre à jour le vetting d\'un créateur (AGENCY uniquement)',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
                    comment: { type: 'string', example: 'Profil vérifié, qualité OK' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Vetting mis à jour' },
            403: { description: 'Accès refusé' },
          },
        },
      },

      '/api/v1/creators/me/portfolio': {
        post: {
          tags: ['Creators'],
          summary: 'Ajouter un item au portfolio',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'url'],
                  properties: {
                    title: { type: 'string', example: 'Reel Nike collab' },
                    url: { type: 'string', format: 'uri' },
                    thumbnail: { type: 'string', format: 'uri' },
                    platform: { type: 'string', enum: ['TIKTOK','INSTAGRAM','YOUTUBE','TWITTER','LINKEDIN','PINTEREST'] },
                    views: { type: 'integer', example: 15000 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Item ajouté' },
          },
        },
      },

      '/api/v1/creators/me/portfolio/{itemId}': {
        delete: {
          tags: ['Creators'],
          summary: 'Supprimer un item du portfolio',
          parameters: [
            { name: 'itemId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: {
            200: { description: 'Item supprimé' },
            404: { description: 'Item introuvable' },
          },
        },
      },

      // ─────────────────────────────────────────
      // BRANDS
      // ─────────────────────────────────────────
      '/api/v1/brands': {
        post: {
          tags: ['Brands'],
          summary: 'Créer une brand (AGENCY uniquement)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'slug', 'category'],
                  properties: {
                    name: { type: 'string', example: 'Nike France' },
                    slug: { type: 'string', example: 'nike-france' },
                    description: { type: 'string' },
                    logo: { type: 'string', format: 'uri' },
                    website: { type: 'string', format: 'uri', example: 'https://nike.com' },
                    category: { type: 'string', enum: ['BEAUTY','FASHION','TECH','FOOD','SPORT','HEALTH','HOME','TRAVEL','FINANCE','EDUCATION','OTHER'] },
                    legalName: { type: 'string' },
                    vatNumber: { type: 'string' },
                    country: { type: 'string', example: 'France' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Brand créée' },
            409: { description: 'Slug déjà utilisé' },
          },
        },
        get: {
          tags: ['Brands'],
          summary: 'Lister mes brands',
          responses: {
            200: { description: 'Liste retournée' },
          },
        },
      },

      '/api/v1/brands/{id}': {
        get: {
          tags: ['Brands'],
          summary: 'Récupérer une brand par ID',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: {
            200: { description: 'Brand retournée' },
            404: { description: 'Introuvable' },
          },
        },
        patch: {
          tags: ['Brands'],
          summary: 'Mettre à jour une brand',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    logo: { type: 'string', format: 'uri' },
                    website: { type: 'string', format: 'uri' },
                    category: { type: 'string' },
                    country: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Brand mise à jour' } },
        },
        delete: {
          tags: ['Brands'],
          summary: 'Désactiver une brand',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: { 200: { description: 'Brand désactivée' } },
        },
      },

      '/api/v1/brands/{id}/products': {
        post: {
          tags: ['Brands'],
          summary: 'Ajouter un produit à une brand',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'Air Max 2024' },
                    description: { type: 'string' },
                    url: { type: 'string', format: 'uri' },
                    imageUrl: { type: 'string', format: 'uri' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Produit ajouté' } },
        },
      },

      '/api/v1/brands/{id}/products/{productId}': {
        delete: {
          tags: ['Brands'],
          summary: 'Supprimer un produit',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
            { name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: { 200: { description: 'Produit supprimé' } },
        },
      },

      // ─────────────────────────────────────────
      // SEARCH
      // ─────────────────────────────────────────
      '/api/v1/search/creators': {
        get: {
          tags: ['Search'],
          summary: 'Recherche filtrée de créateurs',
          parameters: [
            { name: 'niche', in: 'query', schema: { type: 'string', enum: ['BEAUTY','FASHION','TECH','FOOD','TRAVEL','FITNESS','GAMING','LIFESTYLE','PARENTING','FINANCE','EDUCATION','OTHER'] } },
            { name: 'platform', in: 'query', schema: { type: 'string', enum: ['TIKTOK','INSTAGRAM','YOUTUBE','TWITTER','LINKEDIN','PINTEREST'] } },
            { name: 'level', in: 'query', schema: { type: 'string', enum: ['NANO','MICRO','MACRO','MEGA'] } },
            { name: 'location', in: 'query', schema: { type: 'string', example: 'Paris' } },
            { name: 'isAvailable', in: 'query', schema: { type: 'boolean' } },
            { name: 'minFollowers', in: 'query', schema: { type: 'integer', example: 10000 } },
            { name: 'vettingStatus', in: 'query', schema: { type: 'string', enum: ['PENDING','APPROVED','REJECTED'], default: 'APPROVED' } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          ],
          responses: {
            200: {
              description: 'Résultats de recherche',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { type: 'array', items: { $ref: '#/components/schemas/Creator' } },
                      meta: {
                        type: 'object',
                        properties: {
                          total: { type: 'integer' },
                          page: { type: 'integer' },
                          limit: { type: 'integer' },
                          totalPages: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ─────────────────────────────────────────
      // MATCHING
      // ─────────────────────────────────────────
      '/api/v1/matching': {
        post: {
          tags: ['Matching'],
          summary: 'Matcher des créateurs selon des critères (AGENCY uniquement)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    niches: {
                      type: 'array',
                      items: { type: 'string' },
                      example: ['TECH', 'LIFESTYLE'],
                    },
                    platforms: {
                      type: 'array',
                      items: { type: 'string' },
                      example: ['INSTAGRAM', 'TIKTOK'],
                    },
                    level: { type: 'string', enum: ['NANO','MICRO','MACRO','MEGA'], example: 'MICRO' },
                    location: { type: 'string', example: 'Paris' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Créateurs matchés et scorés',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          results: { type: 'array', items: { $ref: '#/components/schemas/Creator' } },
                          total: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: { description: 'Aucun critère fourni' },
            403: { description: 'Accès refusé' },
          },
        },
      },
    },
  },
  apis: [], // ← vide car tout est défini ci-dessus
};

module.exports = swaggerJsDoc(options);