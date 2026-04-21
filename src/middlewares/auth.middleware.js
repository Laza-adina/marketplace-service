// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

/**
 * Vérifie le JWT émis par le Auth Service
 * Le token est signé avec JWT_ACCESS_SECRET (partagé entre services)
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant',
      });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
        issuer: 'ugc-platform',
        audience: 'ugc-client',
      });
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: err.name === 'TokenExpiredError' ? 'Token expiré' : 'Token invalide',
      });
    }

    // Injection du user dans req (vient du payload du auth-service)
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification',
    });
  }
};

module.exports = { authenticate };