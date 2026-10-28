const express = require('express');
const router = express.Router();
const { getPackages, getFeaturedPackages, getPackageBySlug } = require('../controllers/packageController');

router.get('/', getPackages);
router.get('/featured', getFeaturedPackages);
router.get('/:slug', getPackageBySlug);

module.exports = router;

