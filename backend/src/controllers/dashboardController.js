const Order = require('../models/Order');
const Package = require('../models/Package');
const Service = require('../models/Service');
const MarketplaceListing = require('../models/MarketplaceListing');
const { sendSuccess, sendError } = require('../utils/response');

const getDashboard = async (req, res, next) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      cancelledOrders,
      revenueAgg,
      recentOrders,
      totalPackages,
      totalServices,
      totalChannels,
      totalVideos,
    ] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.countDocuments({ orderStatus: 'processing' }),
      Order.countDocuments({ orderStatus: 'completed' }),
      Order.countDocuments({ orderStatus: 'cancelled' }),
      // Revenue: only paid and non-cancelled orders
      Order.aggregate([
        { $match: { paymentStatus: 'paid', orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.find({}).sort({ createdAt: -1 }).limit(8).lean(),
      Package.countDocuments({}),
      Service.countDocuments({}),
      MarketplaceListing.countDocuments({ listingType: 'channel' }),
      MarketplaceListing.countDocuments({ listingType: 'video' }),
    ]);

    const revenue = revenueAgg[0]?.total || 0;

    return sendSuccess(res, {
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      cancelledOrders,
      revenue,
      recentOrders,
      catalog: {
        packages: totalPackages,
        services: totalServices,
        channels: totalChannels,
        videos: totalVideos,
      },
    });
  } catch (err) { next(err); }
};

module.exports = { getDashboard };

