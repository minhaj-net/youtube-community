const Admin = require('../models/Admin');
const User = require('../models/User');

/**
 * Ensures the default administrator account from environment variables exists,
 * is active with the proper role, and purges any conflicting User record with the same email.
 */
async function ensureDefaultAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  const role = process.env.ADMIN_ROLE || 'superadmin';

  if (!email || !password) {
    return;
  }

  try {
    // 1. Remove any conflicting regular user created with this email
    await User.deleteMany({ email });

    // 2. Find or create the Admin account
    let admin = await Admin.findOne({ email }).select('+passwordHash');
    if (!admin) {
      await Admin.create({
        email,
        passwordHash: password,
        role,
        isActive: true,
      });
      console.log(`[Admin] Default administrator initialized (${email}).`);
    } else {
      let shouldSave = false;
      if (!admin.isActive) {
        admin.isActive = true;
        shouldSave = true;
      }
      if (admin.role !== role) {
        admin.role = role;
        shouldSave = true;
      }
      const matches = await admin.comparePassword(password);
      if (!matches) {
        admin.passwordHash = password; // Will be hashed by pre('save')
        shouldSave = true;
      }
      if (shouldSave) {
        await admin.save();
        console.log(`[Admin] Default administrator synchronized (${email}).`);
      }
    }
  } catch (err) {
    console.error('[Admin] Error ensuring default admin:', err.message);
  }
}

module.exports = { ensureDefaultAdmin };

