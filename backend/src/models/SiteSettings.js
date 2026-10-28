const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    logoUrl: { type: String, default: '' },
    footerPhone: { type: String, default: '' },
    footerEmail: {
      type: String,
      default: '',
      match: [/^\S+@\S+\.\S+$|^$/, 'Invalid email format'],
    },
    whatsAppNumber: { type: String, default: '' },
  },
  { timestamps: true }
);

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
module.exports = SiteSettings;

