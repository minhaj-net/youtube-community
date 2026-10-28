const { nanoid } = require('crypto');

/**
 * Generate a unique order number like YT-893421
 */
const generateOrderNumber = () => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `YT-${num}`;
};

/**
 * Build a URL-safe slug from a string
 */
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

module.exports = { generateOrderNumber, slugify };

