const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ─── Admin Auth ─────────────────────────────────────────────────────────────

const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required.', 400);
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!admin || !admin.isActive) {
      return sendError(res, 'Invalid credentials.', 401);
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials.', 401);
    }

    admin.lastLoginAt = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = signToken(admin._id, admin.role);

    return sendSuccess(
      res,
      {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
          isActive: admin.isActive,
        },
      },
      'Login successful'
    );
  } catch (err) {
    next(err);
  }
};

const adminLogout = (req, res) => {
  // JWT is stateless; client clears token. Server-side: no action needed.
  return sendSuccess(res, null, 'Logged out successfully');
};

const adminGetMe = async (req, res, next) => {
  try {
    return sendSuccess(res, {
      id: req.admin._id,
      email: req.admin.email,
      role: req.admin.role,
      isActive: req.admin.isActive,
    });
  } catch (err) {
    next(err);
  }
};

// ─── User Auth ───────────────────────────────────────────────────────────────

const userRegister = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return sendError(res, 'Name, email, and password are required.', 400);
    }
    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters.', 400);
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return sendError(res, 'An account with this email already exists.', 409);
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim(),
      passwordHash: password,
    });

    const token = signToken(user._id, 'user');

    return sendSuccess(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      },
      'Account created successfully',
      201
    );
  } catch (err) {
    next(err);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required.', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Try finding regular User
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (user && user.isActive) {
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        user.lastLoginAt = new Date();
        await user.save({ validateBeforeSave: false });

        const token = signToken(user._id, 'user');

        return sendSuccess(
          res,
          {
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone,
            },
          },
          'Login successful'
        );
      }
    }

    // 2. Check if credentials belong to an Admin account
    const admin = await Admin.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (admin && admin.isActive) {
      const isMatch = await admin.comparePassword(password);
      if (isMatch) {
        admin.lastLoginAt = new Date();
        await admin.save({ validateBeforeSave: false });

        const token = signToken(admin._id, admin.role || 'superadmin');

        return sendSuccess(
          res,
          {
            token,
            isAdmin: true,
            role: admin.role,
            user: {
              id: admin._id,
              name: 'Administrator',
              email: admin.email,
              role: admin.role,
            },
            admin: {
              id: admin._id,
              email: admin.email,
              role: admin.role,
              isActive: admin.isActive,
            },
          },
          'Admin login successful'
        );
      }
    }

    return sendError(res, 'Invalid credentials.', 401);
  } catch (err) {
    next(err);
  }
};

const userGetMe = async (req, res, next) => {
  try {
    return sendSuccess(res, {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
    });
  } catch (err) {
    next(err);
  }
};

const userLogout = (req, res) => {
  return sendSuccess(res, null, 'Logged out successfully');
};

module.exports = {
  adminLogin,
  adminLogout,
  adminGetMe,
  userRegister,
  userLogin,
  userGetMe,
  userLogout,
};

