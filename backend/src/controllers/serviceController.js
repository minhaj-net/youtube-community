const Service = require('../models/Service');
const { sendSuccess, sendError } = require('../utils/response');
const { slugify } = require('../utils/helpers');

// ─── Public ──────────────────────────────────────────────────────────────────

const getServices = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }
    const services = await Service.find(filter).sort({ sortOrder: 1, createdAt: 1 }).lean();
    return sendSuccess(res, services);
  } catch (err) { next(err); }
};

const getFeaturedServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true, isFeatured: true })
      .sort({ sortOrder: 1 })
      .lean();
    return sendSuccess(res, services);
  } catch (err) { next(err); }
};

const getServiceBySlug = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true }).lean();
    if (!service) return sendError(res, 'Service not found.', 404);
    return sendSuccess(res, service);
  } catch (err) { next(err); }
};

// ─── Admin ───────────────────────────────────────────────────────────────────

const adminGetServices = async (req, res, next) => {
  try {
    const services = await Service.find({}).sort({ sortOrder: 1, createdAt: 1 }).lean();
    return sendSuccess(res, services);
  } catch (err) { next(err); }
};

const adminCreateService = async (req, res, next) => {
  try {
    const { name, slug, description, category, price, currency, image, features, deliveryInformation, isFeatured, isActive, sortOrder } = req.body;
    if (!name || !category || price === undefined) {
      return sendError(res, 'Name, category, and price are required.', 400);
    }
    const computedSlug = slug || slugify(name);
    const existing = await Service.findOne({ slug: computedSlug });
    if (existing) return sendError(res, `Slug "${computedSlug}" is already in use.`, 409);

    const service = await Service.create({
      name, slug: computedSlug, description, category, price: Number(price),
      currency, image, features, deliveryInformation, isFeatured, isActive, sortOrder,
    });
    return sendSuccess(res, service, 'Service created successfully', 201);
  } catch (err) { next(err); }
};

const adminUpdateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.name && !updates.slug) updates.slug = slugify(updates.name);

    const service = await Service.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!service) return sendError(res, 'Service not found.', 404);
    return sendSuccess(res, service, 'Service updated successfully');
  } catch (err) { next(err); }
};

const adminDeleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return sendError(res, 'Service not found.', 404);
    return sendSuccess(res, null, 'Service deleted successfully');
  } catch (err) { next(err); }
};

module.exports = {
  getServices, getFeaturedServices, getServiceBySlug,
  adminGetServices, adminCreateService, adminUpdateService, adminDeleteService,
};

