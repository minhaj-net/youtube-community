const express = require('express');
const router = express.Router();
const { createOrder, getOrderByNumber, getUserOrders } = require('../controllers/orderController');
const { optionalUser, requireUser } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const orderLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many order requests. Please slow down.' },
});

router.post('/', orderLimiter, optionalUser, createOrder);
router.get('/my-orders', requireUser, getUserOrders);
router.get('/:orderNumber', getOrderByNumber);

module.exports = router;

