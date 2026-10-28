const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const { sendError } = require('../utils/response');

/**
 * Middleware: require a valid admin JWT
 */
const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Unauthorized. No token provided.', 401);
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return sendError(res, 'Invalid or expired token.', 401);
    }

    if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
      return sendError(res, 'Forbidden. Admin access required.', 403);
    }

    const admin = await Admin.findById(decoded.id).select('-passwordHash');
    if (!admin || !admin.isActive) {
      return sendError(res, 'Admin account not found or deactivated.', 401);
    }

    req.admin = admin;
    next();
  } catch (err) {
    return sendError(res, 'Authentication error.', 500);
  }
};

/**
 * Middleware: require a valid user JWT
 */
const requireUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Unauthorized. No token provided.', 401);
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return sendError(res, 'Invalid or expired token.', 401);
    }

    if (decoded.role !== 'user') {
      return sendError(res, 'Forbidden. User access required.', 403);
    }

    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user || !user.isActive) {
      return sendError(res, 'User account not found or deactivated.', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    return sendError(res, 'Authentication error.', 500);
  }
};

/**
 * Optional user auth — attaches user to req if token is present and valid
 */
const optionalUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return next();
    }

    if (decoded.role === 'user') {
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (user && user.isActive) req.user = user;
    }
    next();
  } catch {
    next();
  }
};

module.exports = { requireAdmin, requireUser, optionalUser };

