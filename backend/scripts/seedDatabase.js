require('dotenv').config({ path: __dirname + '/../.env' });
const dns = require('node:dns');
try {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
} catch (e) {
  // ignore if not supported
}
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');
const User = require('../src/models/User');
const Order = require('../src/models/Order');
const Package = require('../src/models/Package');
const Service = require('../src/models/Service');
const MarketplaceListing = require('../src/models/MarketplaceListing');
const SiteSettings = require('../src/models/SiteSettings');

const seedPackages = [
  {
    name: '100 Growth Units',
    slug: '100-growth-units',
    description: 'Entry tier organic creator audience promotion for kickstarting channel impressions.',
    category: 'Audience Growth',
    quantity: 100,
    price: 160,
    currency: '৳',
    isFeatured: false,
    isActive: true,
    sortOrder: 1,
    features: [
      '100 Genuine Promotion Impressions',
      'High-Retention Viewer Engagement',
      'Compliant with YouTube Guidelines',
      'Delivery starts within 2-4 Hours',
      '24/7 WhatsApp Support',
    ],
  },
  {
    name: '250 Growth Units',
    slug: '250-growth-units',
    description: 'Steady audience expansion package tailored for active uploading creators.',
    category: 'Audience Growth',
    quantity: 250,
    price: 400,
    currency: '৳',
    isFeatured: false,
    isActive: true,
    sortOrder: 2,
    features: [
      '250 Organic Promotion Reach',
      'Natural Traffic Distribution',
      'Algorithm-Safe Promotion Methods',
      'Natural Growth Pacing',
      'Live Tracking Support',
    ],
  },
  {
    name: '500 Growth Units',
    slug: '500-growth-units',
    description: 'Accelerate milestone achievement with targeted niche creator exposure.',
    category: 'Audience Growth',
    quantity: 500,
    price: 800,
    currency: '৳',
    isFeatured: false,
    isActive: true,
    sortOrder: 3,
    features: [
      '500 High-Impact Reach Units',
      'Targeted Demographic Exposure',
      'Safe Discovery & Suggested Views',
      'Guaranteed Gradual Delivery',
      'Dedicated Priority Queue',
    ],
  },
  {
    name: '1,000 Growth Units',
    slug: '1000-growth-units',
    description: 'The golden milestone package for creators looking to reach monetization milestones.',
    category: 'Audience Growth',
    quantity: 1000,
    price: 1600,
    currency: '৳',
    isFeatured: true,
    isActive: true,
    sortOrder: 4,
    features: [
      '1,000 Monetization Milestone Units',
      '100% Policy Compliant Promotion',
      'Optimized Retention Velocity',
      'Real Creator Audience Feeds',
      'Free Channel Audit Checklist',
      'Direct Priority WhatsApp Support',
    ],
  },
  {
    name: '2,500 Growth Units',
    slug: '2500-growth-units',
    description: 'High-volume community builder for scaling channels and growing watch frequency.',
    category: 'Audience Growth',
    quantity: 2500,
    price: 4000,
    currency: '৳',
    isFeatured: false,
    isActive: true,
    sortOrder: 5,
    features: [
      '2,500 Audience Growth Reach',
      'Multi-source compliant promotion',
      'Natural drip-feed delivery curve',
      'Audience Analytics Report',
      'Senior Growth Specialist assigned',
    ],
  },
  {
    name: '5,000 Growth Units',
    slug: '5000-growth-units',
    description: 'Pro creator package designed for established channels entering authority rankings.',
    category: 'Audience Growth',
    quantity: 5000,
    price: 8000,
    currency: '৳',
    isFeatured: false,
    isActive: true,
    sortOrder: 6,
    features: [
      '5,000 Enterprise Reach Units',
      'Comprehensive Engagement Campaign',
      'Smart Algorithm Drip Feeder',
      'Dedicated Account Manager',
      'Detailed Performance Report',
    ],
  },
  {
    name: '10,000 Growth Units',
    slug: '10000-growth-units',
    description: 'Ultimate platform domination package for brand channels, studios, and top creators.',
    category: 'Audience Growth',
    quantity: 10000,
    price: 16000,
    currency: '৳',
    isFeatured: false,
    isActive: true,
    sortOrder: 7,
    features: [
      '10,000 High-Velocity Authority Reach',
      'Maximum Retention Drip Strategy',
      'Cross-platform Promotion Network',
      '1-on-1 Strategy Consultation',
      'Lifetime Growth Warranty & Support',
    ],
  },
];

const seedServices = [
  {
    name: 'High-CTR Custom Thumbnail Design',
    slug: 'high-ctr-thumbnail-design',
    description: 'Eye-catching, custom-crafted YouTube thumbnails designed to dramatically boost click-through rates (CTR).',
    category: 'Thumbnail Design',
    price: 350,
    currency: '৳',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    features: ['3 Unique Design Concepts', 'High Resolution 1080p', 'Optimized Color Psychology', 'Delivered in 24 Hours', 'Unlimited Revisions'],
    deliveryInformation: 'Initial drafts delivered within 24 hours. Source PSD included.',
    isFeatured: true,
    isActive: true,
    sortOrder: 1,
  },
  {
    name: 'Professional Long-form Video Editing',
    slug: 'pro-video-editing',
    description: 'Cinematic pacing, sound design, motion graphics, and narrative editing that keeps retention graph high.',
    category: 'Video Editing',
    price: 1800,
    currency: '৳',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    features: ['Up to 15 min final duration', 'Custom Motion Graphics & B-Roll', 'Pro Sound Effects & Mixing', 'Color Grading & Polish', '2 Revision Rounds'],
    deliveryInformation: 'Turnaround within 48 to 72 hours via Google Drive or Frame.io.',
    isFeatured: true,
    isActive: true,
    sortOrder: 2,
  },
  {
    name: 'Viral Shorts & Reels Editing Pack',
    slug: 'shorts-reels-editing-pack',
    description: 'Fast-paced, subtitled, animated short-form video edits engineered for YouTube Shorts viral algorithms.',
    category: 'Shorts Editing',
    price: 650,
    currency: '৳',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
    features: ['Dynamic Karaoke Subtitles', 'Sound Effects & Soundtracks', 'Zoom cuts & Hook retention beats', 'Vertical 9:16 Ultra HD', 'Fast 24h delivery'],
    deliveryInformation: 'Turnaround in 24 hours per short.',
    isFeatured: true,
    isActive: true,
    sortOrder: 3,
  },
  {
    name: 'Full YouTube SEO & Keyword Optimization',
    slug: 'youtube-seo-optimization',
    description: 'In-depth keyword research, title crafting, description optimization, and tag setup to rank in search results.',
    category: 'YouTube SEO',
    price: 750,
    currency: '৳',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    features: ['Target Keyword Research', 'CTR-Boosted Title Variations', 'Algorithm-optimized description', 'Competitor Gap Analysis', 'Custom Tag Cloud'],
    deliveryInformation: 'Full SEO report & upload-ready metadata in 24 hours.',
    isFeatured: true,
    isActive: true,
    sortOrder: 4,
  },
  {
    name: 'Comprehensive Channel Audit & Strategy',
    slug: 'channel-audit-strategy',
    description: 'Deep-dive analysis of your analytics, retention graphs, CTR, viewer drop-off, and tailored 90-day growth roadmap.',
    category: 'Channel Audit',
    price: 1500,
    currency: '৳',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    features: ['10+ Page Analytics Review', 'CTR & Retention Breakdown', '90-Day Content Blueprint', 'Branding & Layout Review', '1-Hour Strategy Audio Call'],
    deliveryInformation: 'Comprehensive PDF delivered within 3 business days.',
    isFeatured: false,
    isActive: true,
    sortOrder: 5,
  },
  {
    name: 'Premium Channel Banner & Branding Kit',
    slug: 'channel-banner-branding',
    description: 'Cohesive channel banner, matching profile avatar, watermark, and end-screen branding for a top-tier look.',
    category: 'Banner Design',
    price: 850,
    currency: '৳',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    features: ['Multi-device Responsive Banner', 'Matching Avatar / Logo', 'Custom Video Watermark', 'End-screen templates', 'All source files included'],
    deliveryInformation: 'Delivered in 24 to 48 hours.',
    isFeatured: false,
    isActive: true,
    sortOrder: 6,
  },
];

const seedChannels = [
  {
    listingType: 'channel',
    title: 'TechNexus Reviews & Unboxing',
    slug: 'technexus-reviews',
    description: 'Established tech and gadget review channel with loyal audience, clean copyright history, and active monetization enabled.',
    category: 'Technology & Gadgets',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    price: 45000,
    currency: '৳',
    subscribers: 34500,
    monthlyViews: 120000,
    monetized: true,
    niche: 'Tech & Gadgets',
    verified: true,
    sellerContact: 'support@ytmarket.com',
    status: 'published',
  },
  {
    listingType: 'channel',
    title: 'GamerForge Highlights & Esports',
    slug: 'gamerforge-highlights',
    description: 'Rapidly growing gaming clip and commentary channel with high engagement in Minecraft, Valorant, and GTA V.',
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    price: 28000,
    currency: '৳',
    subscribers: 18200,
    monthlyViews: 95000,
    monetized: true,
    niche: 'Gaming',
    verified: false,
    sellerContact: 'support@ytmarket.com',
    status: 'published',
  },
  {
    listingType: 'channel',
    title: 'Culinary Flavors Cooking Hub',
    slug: 'culinary-flavors-hub',
    description: 'Food and lifestyle recipe channel featuring step-by-step videos. Clean history and evergreen viewer base.',
    category: 'Food & Cooking',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
    price: 32000,
    currency: '৳',
    subscribers: 22000,
    monthlyViews: 80000,
    monetized: true,
    niche: 'Food & Lifestyle',
    verified: true,
    sellerContact: 'support@ytmarket.com',
    status: 'published',
  },
  {
    listingType: 'channel',
    title: 'Pulse Finance & Wealth Academy',
    slug: 'pulse-finance-academy',
    description: 'High-RPM personal finance and investing education channel with prime tier-1 audience demographics.',
    category: 'Finance & Business',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    price: 65000,
    currency: '৳',
    subscribers: 41000,
    monthlyViews: 140000,
    monetized: true,
    niche: 'Personal Finance',
    verified: true,
    sellerContact: 'support@ytmarket.com',
    status: 'published',
  },
];

const seedVideos = [
  {
    listingType: 'video',
    title: 'Complete 4K Cyberpunk City Documentary B-Roll',
    slug: '4k-cyberpunk-city-broll',
    description: 'Original cinematic 4K neon city drone shots and night street scenes, fully cleared with commercial usage rights.',
    category: 'Cinematic B-Roll',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    price: 3200,
    currency: '৳',
    duration: '14 min 30 sec',
    resolution: '4K UHD (3840x2160)',
    rightsIncluded: ['Commercial Worldwide License', 'Monetization Allowed', 'No Royalties Required', 'Color Graded ProRes 422'],
    deliverables: 'Raw ProRes 422 + H.264 masters delivered via high-speed cloud link.',
    status: 'published',
  },
  {
    listingType: 'video',
    title: 'Top 10 AI Tools That Will Replace You in 2026',
    slug: 'top-10-ai-tools-2026',
    description: 'Turnkey, fully edited, narrated faceless video with custom script, pro voiceover, motion graphics, and sound design.',
    category: 'Turnkey Faceless Videos',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    price: 4500,
    currency: '৳',
    duration: '11 min 45 sec',
    resolution: '1080p 60fps',
    rightsIncluded: ['Exclusive Single-Buyer Ownership', 'Ready to Upload', 'Thumbnail PSD Included', 'Full Script & Metadata'],
    deliverables: 'Master MP4 file, SRT captions, SEO Title/Description/Tags, PSD Thumbnail.',
    status: 'published',
  },
  {
    listingType: 'video',
    title: 'Epic Mountain & Glacier Drone Master Suite',
    slug: 'epic-mountain-glacier-drone',
    description: 'Breathtaking alpine drone footage shot on RED Gemini and Mavic 3 Pro Cine with licensed orchestral soundtrack.',
    category: 'Nature & Landscapes',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    price: 2600,
    currency: '৳',
    duration: '08 min 12 sec',
    resolution: '4K 60fps',
    rightsIncluded: ['Royalty-Free Commercial', 'Audio Sync License Included', 'Multi-Project Use'],
    deliverables: 'Downloadable zip package with individual high-bitrate clips.',
    status: 'published',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // 1. Admin Account
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@ytmarket.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@ytmarket2026!';
    let admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      admin = new Admin({
        email: adminEmail,
        passwordHash: adminPassword,
        role: process.env.ADMIN_ROLE || 'superadmin',
        isActive: true,
      });
      await admin.save();
      console.log(`✅ Superadmin created in Admin collection: ${adminEmail}`);
    } else {
      admin.passwordHash = adminPassword;
      admin.role = process.env.ADMIN_ROLE || 'superadmin';
      admin.isActive = true;
      await admin.save();
      console.log(`✅ Superadmin updated in Admin collection: ${adminEmail}`);
    }

    // 2. Also ensure an Admin record in User collection (for universal login compatibility)
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      adminUser = new User({
        name: 'Super Administrator',
        email: adminEmail,
        phone: '+8801700000000',
        passwordHash: adminPassword,
        isActive: true,
      });
      await adminUser.save();
      console.log(`✅ Admin account added to User collection: ${adminEmail}`);
    } else {
      adminUser.passwordHash = adminPassword;
      adminUser.isActive = true;
      await adminUser.save();
      console.log(`✅ Admin account updated in User collection: ${adminEmail}`);
    }

    // 3. Demo User
    let demoUser = await User.findOne({ email: 'tanvir@gmail.com' });
    if (!demoUser) {
      demoUser = new User({
        name: 'Tanvir Ahmed',
        email: 'tanvir@gmail.com',
        phone: '+8801712345678',
        passwordHash: 'user123',
        isActive: true,
      });
      await demoUser.save();
      console.log(`✅ Demo user created: tanvir@gmail.com`);
    } else {
      demoUser.passwordHash = 'user123';
      demoUser.isActive = true;
      await demoUser.save();
      console.log(`✅ Demo user updated: tanvir@gmail.com`);
    }

    // 3. Packages
    for (const pkg of seedPackages) {
      await Package.findOneAndUpdate({ slug: pkg.slug }, pkg, { upsert: true, new: true });
    }
    console.log(`✅ Seeded ${seedPackages.length} packages`);

    // 4. Services
    for (const srv of seedServices) {
      await Service.findOneAndUpdate({ slug: srv.slug }, srv, { upsert: true, new: true });
    }
    console.log(`✅ Seeded ${seedServices.length} services`);

    // 5. Marketplace Channels
    for (const chn of seedChannels) {
      await MarketplaceListing.findOneAndUpdate({ slug: chn.slug }, chn, { upsert: true, new: true });
    }
    console.log(`✅ Seeded ${seedChannels.length} channel listings`);

    // 6. Marketplace Videos
    for (const vid of seedVideos) {
      await MarketplaceListing.findOneAndUpdate({ slug: vid.slug }, vid, { upsert: true, new: true });
    }
    console.log(`✅ Seeded ${seedVideos.length} video listings`);

    // 7. Seed Initial Orders
    const pkgDoc = await Package.findOne({ slug: '1000-growth-units' });
    const srvDoc = await Service.findOne({ slug: 'high-ctr-thumbnail-design' });
    const pkgDoc2 = await Package.findOne({ slug: '250-growth-units' });

    const seedOrders = [
      {
        orderNumber: 'YT-893421',
        userId: demoUser._id,
        customerName: 'Tanvir Ahmed',
        customerPhone: '+8801712345678',
        customerEmail: 'tanvir@gmail.com',
        targetUrl: 'https://youtube.com/@tanvircreator',
        instructions: 'Please pace delivery steadily over 48 hours.',
        items: [
          {
            itemId: pkgDoc?._id || new mongoose.Types.ObjectId(),
            itemType: 'package',
            title: '1,000 Growth Units',
            slug: '1000-growth-units',
            unitPrice: 1600,
            quantity: 1,
            subtotal: 1600,
          },
        ],
        subtotal: 1600,
        discount: 0,
        total: 1600,
        currency: '৳',
        paymentStatus: 'paid',
        orderStatus: 'completed',
        statusHistory: [{ orderStatus: 'completed', paymentStatus: 'paid', note: 'Order completed successfully', changedAt: new Date() }],
      },
      {
        orderNumber: 'YT-904123',
        userId: null,
        customerName: 'Rahim Khan',
        customerPhone: '+8801898765432',
        customerEmail: 'rahim.tech@gmail.com',
        targetUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        instructions: 'Need high CTR thumbnail with bright red text.',
        items: [
          {
            itemId: srvDoc?._id || new mongoose.Types.ObjectId(),
            itemType: 'service',
            title: 'High-CTR Custom Thumbnail Design',
            slug: 'high-ctr-thumbnail-design',
            unitPrice: 350,
            quantity: 2,
            subtotal: 700,
          },
        ],
        subtotal: 700,
        discount: 0,
        total: 700,
        currency: '৳',
        paymentStatus: 'paid',
        orderStatus: 'processing',
        statusHistory: [{ orderStatus: 'processing', paymentStatus: 'paid', note: 'Work in progress', changedAt: new Date() }],
      },
      {
        orderNumber: 'YT-912847',
        userId: null,
        customerName: 'Samira Hossain',
        customerPhone: '+8801655443322',
        customerEmail: 'samira.vlogs@yahoo.com',
        targetUrl: 'https://youtube.com/@samiravlogs',
        instructions: 'Awaiting payment confirmation via bKash.',
        items: [
          {
            itemId: pkgDoc2?._id || new mongoose.Types.ObjectId(),
            itemType: 'package',
            title: '250 Growth Units',
            slug: '250-growth-units',
            unitPrice: 400,
            quantity: 1,
            subtotal: 400,
          },
        ],
        subtotal: 400,
        discount: 0,
        total: 400,
        currency: '৳',
        paymentStatus: 'unpaid',
        orderStatus: 'pending',
        statusHistory: [{ orderStatus: 'pending', paymentStatus: 'unpaid', note: 'Order placed', changedAt: new Date() }],
      },
    ];

    for (const ord of seedOrders) {
      await Order.findOneAndUpdate({ orderNumber: ord.orderNumber }, ord, { upsert: true, new: true });
    }
    console.log(`✅ Seeded ${seedOrders.length} initial orders`);

    // 8. Site Settings
    const existingSettings = await SiteSettings.findOne({});
    if (!existingSettings) {
      await SiteSettings.create({
        footerPhone: '+880 1700-000000',
        footerEmail: 'support@ytmarket.com',
        whatsAppNumber: '+8801700000000',
      });
      console.log('✅ Initialized site settings');
    }

    console.log('🎉 Seeding complete successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();

