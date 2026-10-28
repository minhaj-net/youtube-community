const MarketplaceListing = require('../models/MarketplaceListing');
const { sendSuccess, sendError } = require('../utils/response');
const { slugify } = require('../utils/helpers');

// ─── Shared helpers ───────────────────────────────────────────────────────────

const buildFilter = (listingType, req) => {
  const filter = { listingType, status: 'published' };
  if (req.query.category && req.query.category !== 'All') {
    filter.category = { $regex: req.query.category, $options: 'i' };
  }
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  return filter;
};

// ─── Public Channels ─────────────────────────────────────────────────────────

const getChannels = async (req, res, next) => {
  try {
    const filter = buildFilter('channel', req);
    if (req.query.monetized === 'yes') filter.monetized = true;
    const channels = await MarketplaceListing.find(filter).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, channels);
  } catch (err) { next(err); }
};

const getChannelBySlug = async (req, res, next) => {
  try {
    const channel = await MarketplaceListing.findOne({ slug: req.params.slug, listingType: 'channel', status: 'published' }).lean();
    if (!channel) return sendError(res, 'Channel listing not found.', 404);
    return sendSuccess(res, channel);
  } catch (err) { next(err); }
};

// ─── Public Videos ────────────────────────────────────────────────────────────

const getVideos = async (req, res, next) => {
  try {
    const filter = buildFilter('video', req);
    const videos = await MarketplaceListing.find(filter).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, videos);
  } catch (err) { next(err); }
};

const getVideoBySlug = async (req, res, next) => {
  try {
    const video = await MarketplaceListing.findOne({ slug: req.params.slug, listingType: 'video', status: 'published' }).lean();
    if (!video) return sendError(res, 'Video listing not found.', 404);
    return sendSuccess(res, video);
  } catch (err) { next(err); }
};

// ─── Admin Channels ───────────────────────────────────────────────────────────

const adminGetChannels = async (req, res, next) => {
  try {
    const filter = { listingType: 'channel' };
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { niche: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    const channels = await MarketplaceListing.find(filter).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, channels);
  } catch (err) { next(err); }
};

const adminCreateChannel = async (req, res, next) => {
  try {
    const { title, slug, description, category, image, price, currency, subscribers, monthlyViews, monetized, niche, verified, sellerContact, status } = req.body;
    if (!title || !category || price === undefined) {
      return sendError(res, 'Title, category, and price are required.', 400);
    }
    const computedSlug = slug || slugify(title) + '-' + Date.now();
    const existing = await MarketplaceListing.findOne({ slug: computedSlug });
    if (existing) return sendError(res, `Slug "${computedSlug}" is already in use.`, 409);

    const channel = await MarketplaceListing.create({
      listingType: 'channel', title, slug: computedSlug, description, category, image,
      price: Number(price), currency, subscribers: Number(subscribers) || 0,
      monthlyViews: Number(monthlyViews) || 0, monetized: Boolean(monetized),
      niche, verified: Boolean(verified), sellerContact, status: status || 'published',
    });
    return sendSuccess(res, channel, 'Channel listing created', 201);
  } catch (err) { next(err); }
};

const adminUpdateChannel = async (req, res, next) => {
  try {
    const updates = req.body;
    if (updates.price !== undefined) updates.price = Number(updates.price);
    const channel = await MarketplaceListing.findOneAndUpdate(
      { _id: req.params.id, listingType: 'channel' },
      updates,
      { new: true, runValidators: true }
    );
    if (!channel) return sendError(res, 'Channel listing not found.', 404);
    return sendSuccess(res, channel, 'Channel listing updated');
  } catch (err) { next(err); }
};

const adminDeleteChannel = async (req, res, next) => {
  try {
    const channel = await MarketplaceListing.findOneAndDelete({ _id: req.params.id, listingType: 'channel' });
    if (!channel) return sendError(res, 'Channel listing not found.', 404);
    return sendSuccess(res, null, 'Channel listing deleted');
  } catch (err) { next(err); }
};

// ─── Admin Videos ─────────────────────────────────────────────────────────────

const adminGetVideos = async (req, res, next) => {
  try {
    const filter = { listingType: 'video' };
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { category: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    const videos = await MarketplaceListing.find(filter).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, videos);
  } catch (err) { next(err); }
};

const adminCreateVideo = async (req, res, next) => {
  try {
    const { title, slug, description, category, image, price, currency, duration, resolution, rightsIncluded, deliverables, status } = req.body;
    if (!title || !category || price === undefined) {
      return sendError(res, 'Title, category, and price are required.', 400);
    }
    const computedSlug = slug || slugify(title) + '-' + Date.now();
    const existing = await MarketplaceListing.findOne({ slug: computedSlug });
    if (existing) return sendError(res, `Slug "${computedSlug}" is already in use.`, 409);

    const video = await MarketplaceListing.create({
      listingType: 'video', title, slug: computedSlug, description, category, image,
      price: Number(price), currency, duration, resolution, rightsIncluded, deliverables,
      status: status || 'published',
    });
    return sendSuccess(res, video, 'Video listing created', 201);
  } catch (err) { next(err); }
};

const adminUpdateVideo = async (req, res, next) => {
  try {
    const updates = req.body;
    if (updates.price !== undefined) updates.price = Number(updates.price);
    const video = await MarketplaceListing.findOneAndUpdate(
      { _id: req.params.id, listingType: 'video' },
      updates,
      { new: true, runValidators: true }
    );
    if (!video) return sendError(res, 'Video listing not found.', 404);
    return sendSuccess(res, video, 'Video listing updated');
  } catch (err) { next(err); }
};

const adminDeleteVideo = async (req, res, next) => {
  try {
    const video = await MarketplaceListing.findOneAndDelete({ _id: req.params.id, listingType: 'video' });
    if (!video) return sendError(res, 'Video listing not found.', 404);
    return sendSuccess(res, null, 'Video listing deleted');
  } catch (err) { next(err); }
};

module.exports = {
  getChannels, getChannelBySlug, getVideos, getVideoBySlug,
  adminGetChannels, adminCreateChannel, adminUpdateChannel, adminDeleteChannel,
  adminGetVideos, adminCreateVideo, adminUpdateVideo, adminDeleteVideo,
};

