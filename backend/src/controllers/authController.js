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

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
    if (!admin || !admin.isActive) {
      return sendError(res, 'Invalid credentials.', 401);
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials.', 401);
    }

    admin.lastLoginAt = new Date();
    await admin.save({ validateBeforeSave: false });

    const role = admin.role || 'superadmin';
    const token = signToken(admin._id, role);

    return sendSuccess(
      res,
      {
        token,
        isAdmin: true,
        role,
        admin: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
          isActive: admin.isActive,
        },
        user: {
          id: admin._id,
          name: 'Administrator',
          email: admin.email,
          role,
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
      role: req.admin.role || 'superadmin',
      isAdmin: true,
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

    const normalizedEmail = email.toLowerCase().trim();

    // Prevent regular user registration using configured admin email or any admin email
    const configuredAdminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    if (configuredAdminEmail && normalizedEmail === configuredAdminEmail) {
      return sendError(res, 'This email address is reserved for administrator accounts.', 400);
    }

    const adminAccount = await Admin.findOne({ email: normalizedEmail });
    if (adminAccount) {
      return sendError(res, 'This email address is reserved for administrator accounts.', 400);
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return sendError(res, 'An account with this email already exists.', 409);
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim(),
      passwordHash: password,
    });

    const token = signToken(user._id, 'user');

    return sendSuccess(
      res,
      {
        token,
        isAdmin: false,
        role: 'user',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: 'user',
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

    // 1. Check if credentials belong to an Admin account first
    const admin = await Admin.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (admin) {
      if (!admin.isActive) {
        return sendError(res, 'Account is deactivated.', 403);
      }
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return sendError(res, 'Invalid credentials.', 401);
      }

      admin.lastLoginAt = new Date();
      await admin.save({ validateBeforeSave: false });

      const role = admin.role || 'superadmin';
      const token = signToken(admin._id, role);

      return sendSuccess(
        res,
        {
          token,
          isAdmin: true,
          role,
          user: {
            id: admin._id,
            name: 'Administrator',
            email: admin.email,
            role,
          },
          admin: {
            id: admin._id,
            email: admin.email,
            role,
            isActive: admin.isActive,
          },
        },
        'Admin login successful'
      );
    }

    // 2. Otherwise check for regular User account
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
            isAdmin: false,
            role: 'user',
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              role: 'user',
            },
          },
          'Login successful'
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
      role: 'user',
      isAdmin: false,
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

