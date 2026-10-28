const express = require('express');
const router = express.Router();
const { getServices, getFeaturedServices, getServiceBySlug } = require('../controllers/serviceController');

router.get('/', getServices);
router.get('/featured', getFeaturedServices);
router.get('/:slug', getServiceBySlug);

module.exports = router;

