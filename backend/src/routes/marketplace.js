const express = require('express');
const router = express.Router();
const { getChannels, getChannelBySlug, getVideos, getVideoBySlug } = require('../controllers/marketplaceController');

router.get('/channels', getChannels);
router.get('/channels/:slug', getChannelBySlug);
router.get('/videos', getVideos);
router.get('/videos/:slug', getVideoBySlug);

module.exports = router;

