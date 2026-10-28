/**
 * Seed Admin Script
 * 
 * Usage: node scripts/seedAdmin.js
 * 
 * Creates the first admin account safely.
 * Set ADMIN_EMAIL and ADMIN_PASSWORD env vars, or it uses defaults for local dev only.
 * 
 * NEVER run this with production credentials in plain text.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');

const run = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@ytmarket.com';
  const password = process.env.ADMIN_PASSWORD;
  const role = process.env.ADMIN_ROLE || 'superadmin';

  if (!password) {
    console.error('❌ ADMIN_PASSWORD environment variable is required.');
    console.error('   Run: ADMIN_PASSWORD=yourSecurePassword node scripts/seedAdmin.js');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌ ADMIN_PASSWORD must be at least 8 characters.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`ℹ️  Admin with email "${email}" already exists. Skipping creation.`);
    await mongoose.disconnect();
    return;
  }

  await Admin.create({ email, passwordHash: password, role, isActive: true });
  console.log(`✅ Admin created: ${email} [${role}]`);
  console.log('   You can now log in at /login');

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});

