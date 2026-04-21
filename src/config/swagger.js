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
    },
    security: [{ BearerAuth: [] }],
    tags: [
      { name: 'Creators', description: 'Profils créateurs / influenceurs' },
      { name: 'Brands', description: 'Profils marques gérés par les agences' },
      { name: 'Search', description: 'Recherche filtrée de créateurs' },
      { name: 'Matching', description: 'Matching créateurs ↔ critères' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsDoc(options);