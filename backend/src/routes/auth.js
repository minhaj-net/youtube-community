const express = require('express');
const router = express.Router();
const { adminLogin, adminLogout, adminGetMe, userRegister, userLogin, userGetMe, userLogout } = require('../controllers/authController');
const { requireAdmin, requireUser } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts. Please wait 15 minutes and try again.' },
});

// Admin auth
router.post('/admin/login', loginLimiter, adminLogin);
router.post('/admin/logout', requireAdmin, adminLogout);
router.get('/admin/me', requireAdmin, adminGetMe);

// User auth
router.post('/user/register', userRegister);
router.post('/user/login', loginLimiter, userLogin);
router.post('/user/logout', requireUser, userLogout);
router.get('/user/me', requireUser, userGetMe);

module.exports = router;

