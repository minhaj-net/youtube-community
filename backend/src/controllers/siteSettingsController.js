const SiteSettings = require('../models/SiteSettings');
const { sendSuccess, sendError } = require('../utils/response');

const getSiteSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne({}).lean();
    if (!settings) {
      // Create default if none exists
      settings = await SiteSettings.create({
        footerPhone: '+880 1700-000000',
        footerEmail: 'support@ytmarket.com',
        whatsAppNumber: '+8801700000000',
      });
    }
    return sendSuccess(res, settings);
  } catch (err) { next(err); }
};

const adminUpdateSiteSettings = async (req, res, next) => {
  try {
    const { logoUrl, footerPhone, footerEmail, whatsAppNumber } = req.body;
    let settings = await SiteSettings.findOne({});
    if (!settings) {
      settings = new SiteSettings({});
    }
    if (logoUrl !== undefined) settings.logoUrl = logoUrl;
    if (footerPhone !== undefined) settings.footerPhone = footerPhone;
    if (footerEmail !== undefined) settings.footerEmail = footerEmail;
    if (whatsAppNumber !== undefined) settings.whatsAppNumber = whatsAppNumber;
    await settings.save();
    return sendSuccess(res, settings, 'Site settings updated');
  } catch (err) { next(err); }
};

module.exports = { getSiteSettings, adminUpdateSiteSettings };

