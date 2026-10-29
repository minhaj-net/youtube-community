const mongoose = require('mongoose');
const dns = require('node:dns');
const { ensureDefaultAdmin } = require('../utils/seedAdmin');

// On cloud serverless platforms (Vercel/AWS), use the native VPC resolver.
// Only apply public DNS override in local development if needed.
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  try {
    dns.setServers(['1.1.1.1', '8.8.8.8']);
  } catch (e) { }
}

// Global cached connection for serverless execution environments
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // If connection is already open and ready, reuse it immediately
  if (mongoose.connection.readyState === 1) {
    if (!cached.conn) cached.conn = mongoose;
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then(async (m) => {
        console.log(`✅ MongoDB connected: ${m.connection.host}`);
        try {
          await ensureDefaultAdmin();
        } catch (e) {
          console.error('[Admin] ensureDefaultAdmin error:', e.message);
        }
        return m;
      })
      .catch((err) => {
        // Reset cached promise so subsequent requests can retry
        cached.promise = null;
        cached.conn = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    throw err;
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

module.exports = connectDB;

