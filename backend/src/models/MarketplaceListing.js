const mongoose = require('mongoose');

const marketplaceListingSchema = new mongoose.Schema(
  {
    listingType: {
      type: String,
      enum: ['channel', 'video'],
      required: [true, 'Listing type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      default: '৳',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },

    // Channel-specific fields
    subscribers: { type: Number, default: 0 },
    monthlyViews: { type: Number, default: 0 },
    monetized: { type: Boolean, default: false },
    niche: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    sellerContact: { type: String, default: '' },

    // Video-specific fields
    duration: { type: String, default: '' },
    resolution: { type: String, default: '' },
    rightsIncluded: { type: [String], default: [] },
    deliverables: { type: String, default: '' },
  },
  { timestamps: true }
);

marketplaceListingSchema.index({ listingType: 1, status: 1 });
marketplaceListingSchema.index({ category: 1 });

const MarketplaceListing = mongoose.model('MarketplaceListing', marketplaceListingSchema);
module.exports = MarketplaceListing;

