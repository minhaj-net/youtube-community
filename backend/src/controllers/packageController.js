const Package = require('../models/Package');
const { sendSuccess, sendError } = require('../utils/response');
const { slugify } = require('../utils/helpers');

// ─── Public ──────────────────────────────────────────────────────────────────

const getPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();
    return sendSuccess(res, packages);
  } catch (err) { next(err); }
};

const getFeaturedPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ isActive: true, isFeatured: true })
      .sort({ sortOrder: 1 })
      .lean();
    return sendSuccess(res, packages);
  } catch (err) { next(err); }
};

const getPackageBySlug = async (req, res, next) => {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug, isActive: true }).lean();
    if (!pkg) return sendError(res, 'Package not found.', 404);
    return sendSuccess(res, pkg);
  } catch (err) { next(err); }
};

// ─── Admin ───────────────────────────────────────────────────────────────────

const adminGetPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({}).sort({ sortOrder: 1, createdAt: 1 }).lean();
    return sendSuccess(res, packages);
  } catch (err) { next(err); }
};

const adminCreatePackage = async (req, res, next) => {
  try {
    const { name, slug, description, category, quantity, price, currency, image, features, isFeatured, isActive, sortOrder } = req.body;
    if (!name || quantity === undefined || price === undefined) {
      return sendError(res, 'Name, quantity, and price are required.', 400);
    }
    const computedSlug = slug || slugify(name);
    const existing = await Package.findOne({ slug: computedSlug });
    if (existing) return sendError(res, `Slug "${computedSlug}" is already in use.`, 409);

    const pkg = await Package.create({
      name, slug: computedSlug, description, category, quantity: Number(quantity),
      price: Number(price), currency, image, features, isFeatured, isActive, sortOrder,
    });
    return sendSuccess(res, pkg, 'Package created successfully', 201);
  } catch (err) { next(err); }
};

const adminUpdatePackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.quantity !== undefined) updates.quantity = Number(updates.quantity);
    if (updates.name && !updates.slug) updates.slug = slugify(updates.name);

    const pkg = await Package.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!pkg) return sendError(res, 'Package not found.', 404);
    return sendSuccess(res, pkg, 'Package updated successfully');
  } catch (err) { next(err); }
};

const adminDeletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return sendError(res, 'Package not found.', 404);
    return sendSuccess(res, null, 'Package deleted successfully');
  } catch (err) { next(err); }
};

module.exports = {
  getPackages, getFeaturedPackages, getPackageBySlug,
  adminGetPackages, adminCreatePackage, adminUpdatePackage, adminDeletePackage,
};

