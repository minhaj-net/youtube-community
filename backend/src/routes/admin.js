const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const { getDashboard } = require('../controllers/dashboardController');
const { adminGetPackages, adminCreatePackage, adminUpdatePackage, adminDeletePackage } = require('../controllers/packageController');
const { adminGetServices, adminCreateService, adminUpdateService, adminDeleteService } = require('../controllers/serviceController');
const { adminGetChannels, adminCreateChannel, adminUpdateChannel, adminDeleteChannel, adminGetVideos, adminCreateVideo, adminUpdateVideo, adminDeleteVideo } = require('../controllers/marketplaceController');
const { adminGetOrders, adminGetOrderById, adminUpdateOrderStatus } = require('../controllers/orderController');
const { adminUpdateSiteSettings } = require('../controllers/siteSettingsController');

// All admin routes require authentication
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', getDashboard);

// Packages
router.get('/packages', adminGetPackages);
router.post('/packages', adminCreatePackage);
router.patch('/packages/:id', adminUpdatePackage);
router.put('/packages/:id', adminUpdatePackage);
router.delete('/packages/:id', adminDeletePackage);

// Services
router.get('/services', adminGetServices);
router.post('/services', adminCreateService);
router.patch('/services/:id', adminUpdateService);
router.put('/services/:id', adminUpdateService);
router.delete('/services/:id', adminDeleteService);

// Marketplace - Channels
router.get('/marketplace/channels', adminGetChannels);
router.post('/marketplace/channels', adminCreateChannel);
router.patch('/marketplace/channels/:id', adminUpdateChannel);
router.put('/marketplace/channels/:id', adminUpdateChannel);
router.delete('/marketplace/channels/:id', adminDeleteChannel);

// Marketplace - Videos
router.get('/marketplace/videos', adminGetVideos);
router.post('/marketplace/videos', adminCreateVideo);
router.patch('/marketplace/videos/:id', adminUpdateVideo);
router.put('/marketplace/videos/:id', adminUpdateVideo);
router.delete('/marketplace/videos/:id', adminDeleteVideo);

// Orders
router.get('/orders', adminGetOrders);
router.get('/orders/:id', adminGetOrderById);
router.patch('/orders/:id/status', adminUpdateOrderStatus);
router.put('/orders/:id/status', adminUpdateOrderStatus);

// Site settings
router.patch('/site-settings', adminUpdateSiteSettings);
router.put('/site-settings', adminUpdateSiteSettings);

module.exports = router;

