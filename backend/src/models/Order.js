const mongoose = require('mongoose');

const orderLineItemSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId },
    itemType: {
      type: String,
      enum: ['package', 'service', 'channel', 'video'],
      required: true,
    },
    title: { type: String, required: true },
    slug: { type: String },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    orderStatus: { type: String },
    paymentStatus: { type: String },
    note: { type: String },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    // Link to registered user (optional for guest orders)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    targetUrl: { type: String, default: '' },
    instructions: { type: String, default: '' },
    items: {
      type: [orderLineItemSchema],
      required: true,
      validate: {
        validator: (v) => v.length > 0,
        message: 'Order must have at least one item',
      },
    },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: '৳' },
    paymentMethod: { type: String, default: 'manual' },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'failed', 'refunded'],
      default: 'unpaid',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
    statusHistory: [statusHistorySchema],
    idempotencyKey: {
      type: String,
      sparse: true,
      index: true,
    },
  },
  { timestamps: true }
);

orderSchema.index({ customerEmail: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ orderStatus: 1, paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

