require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const packageRoutes = require('./routes/packages');
const serviceRoutes = require('./routes/services');
const marketplaceRoutes = require('./routes/marketplace');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const { getSiteSettings } = require('./controllers/siteSettingsController');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────

app.use(helmet());

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((url) => url.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

// Global rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' },
  })
);

// Body parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Sanitize against NoSQL injection
app.use(mongoSanitize());

// Logging (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'YouTube Marketplace API is running', timestamp: new Date() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/packages', packageRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/marketplace', marketplaceRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin', adminRoutes);
app.get('/api/v1/site-settings', getSiteSettings);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use(errorHandler);

module.exports = app;

