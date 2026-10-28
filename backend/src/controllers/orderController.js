const Order = require('../models/Order');
const Package = require('../models/Package');
const Service = require('../models/Service');
const MarketplaceListing = require('../models/MarketplaceListing');
const { sendSuccess, sendError } = require('../utils/response');
const { generateOrderNumber } = require('../utils/helpers');

// ─── Public: Create Order (Guest or Authenticated User) ──────────────────────

const createOrder = async (req, res, next) => {
  try {
    const { customerName, customerPhone, customerEmail, targetUrl, instructions, items, idempotencyKey } = req.body;

    if (!customerName || !customerPhone || !customerEmail || !items?.length) {
      return sendError(res, 'Customer name, phone, email, and at least one item are required.', 400);
    }

    // Idempotency: prevent duplicate order creation
    if (idempotencyKey) {
      const existing = await Order.findOne({ idempotencyKey }).lean();
      if (existing) {
        return sendSuccess(res, existing, 'Order already exists (idempotent response)');
      }
    }

    // Resolve items from database (server-side price calculation)
    const resolvedItems = [];
    for (const item of items) {
      const { id, itemType, quantity } = item;
      if (!id || !itemType || !quantity || quantity < 1) {
        return sendError(res, `Invalid item: ${JSON.stringify(item)}`, 400);
      }

      let doc = null;
      if (itemType === 'package') {
        doc = await Package.findOne({ _id: id, isActive: true }).lean();
      } else if (itemType === 'service') {
        doc = await Service.findOne({ _id: id, isActive: true }).lean();
      } else if (itemType === 'channel' || itemType === 'video') {
        doc = await MarketplaceListing.findOne({ _id: id, listingType: itemType, status: 'published' }).lean();
      } else {
        return sendError(res, `Unknown item type: ${itemType}`, 400);
      }

      if (!doc) {
        return sendError(res, `Item with id ${id} not found or unavailable.`, 422);
      }

      const unitPrice = doc.price;
      const subtotal = unitPrice * quantity;

      resolvedItems.push({
        itemId: doc._id,
        itemType,
        title: doc.name || doc.title,
        slug: doc.slug || '',
        unitPrice,
        quantity: Number(quantity),
        subtotal,
        image: doc.image || '',
      });
    }

    const subtotal = resolvedItems.reduce((acc, i) => acc + i.subtotal, 0);
    const discount = 0; // No discount system yet
    const total = subtotal - discount;

    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      userId: req.user?._id || null,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.toLowerCase().trim(),
      targetUrl: targetUrl?.trim(),
      instructions: instructions?.trim(),
      items: resolvedItems,
      subtotal,
      discount,
      total,
      currency: '৳',
      paymentStatus: 'unpaid',
      orderStatus: 'pending',
      idempotencyKey: idempotencyKey || null,
      statusHistory: [{ orderStatus: 'pending', paymentStatus: 'unpaid', note: 'Order placed', changedAt: new Date() }],
    });

    return sendSuccess(res, {
      _id: order._id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      total: order.total,
      currency: order.currency,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      createdAt: order.createdAt,
    }, 'Order placed successfully', 201);
  } catch (err) { next(err); }
};

// ─── Public: Get Order by Number (for order confirmation page) ────────────────

const getOrderByNumber = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber }).lean();
    if (!order) return sendError(res, 'Order not found.', 404);

    // Return safe public fields only — no internal customer data leakage for unrelated users
    return sendSuccess(res, {
      _id: order._id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      total: order.total,
      currency: order.currency,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      createdAt: order.createdAt,
    });
  } catch (err) { next(err); }
};

// ─── User: Get Own Order History ──────────────────────────────────────────────

const getUserOrders = async (req, res, next) => {
  try {
    // Match by userId OR by email (to claim guest orders)
    const orders = await Order.find({
      $or: [
        { userId: req.user._id },
        { customerEmail: req.user.email },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();
    return sendSuccess(res, orders);
  } catch (err) { next(err); }
};

// ─── Admin ────────────────────────────────────────────────────────────────────

const adminGetOrders = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.orderStatus = req.query.status;
    }
    if (req.query.paymentStatus && req.query.paymentStatus !== 'all') {
      filter.paymentStatus = req.query.paymentStatus;
    }
    if (req.query.search) {
      const q = req.query.search;
      filter.$or = [
        { orderNumber: { $regex: q, $options: 'i' } },
        { customerName: { $regex: q, $options: 'i' } },
        { customerEmail: { $regex: q, $options: 'i' } },
        { customerPhone: { $regex: q, $options: 'i' } },
      ];
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    return sendSuccess(res, { orders, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

const adminGetOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return sendError(res, 'Order not found.', 404);
    return sendSuccess(res, order);
  } catch (err) { next(err); }
};

const adminUpdateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return sendError(res, 'Order not found.', 404);

    const historyEntry = { changedAt: new Date() };

    if (orderStatus && ['pending', 'processing', 'completed', 'cancelled'].includes(orderStatus)) {
      order.orderStatus = orderStatus;
      historyEntry.orderStatus = orderStatus;
    }
    if (paymentStatus && ['unpaid', 'paid', 'failed', 'refunded'].includes(paymentStatus)) {
      order.paymentStatus = paymentStatus;
      historyEntry.paymentStatus = paymentStatus;
    }
    if (note) historyEntry.note = note;

    order.statusHistory.push(historyEntry);
    await order.save();

    return sendSuccess(res, order, 'Order status updated');
  } catch (err) { next(err); }
};

module.exports = {
  createOrder,
  getOrderByNumber,
  getUserOrders,
  adminGetOrders,
  adminGetOrderById,
  adminUpdateOrderStatus,
};

