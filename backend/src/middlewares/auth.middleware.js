const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Authentication required');
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach decoded payload to req.user
    // We expect { userId, role } based on auth.service.js
    req.user = decoded;
    next();
  } catch (err) {
    const error = new Error('Invalid or expired token');
    error.statusCode = 401;
    next(error);
  }
};

const roleGuard = (requiredRole) => (req, res, next) => {
  if (!req.user || req.user.role !== requiredRole) {
    const error = new Error('Access denied: insufficient permissions');
    error.statusCode = 403;
    return next(error);
  }
  next();
};

module.exports = {
  authenticate,
  roleGuard,
  // Add protect alias if needed
  protect: authenticate
};
