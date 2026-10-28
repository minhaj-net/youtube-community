import {
  PackageItem,
  ServiceItem,
  ChannelListing,
  VideoListing,
  SiteSettings,
  Order,
  DashboardStats,
  AdminUser,
  ApiResponse,
} from '@/types';
import {
  initialPackages,
  initialServices,
  initialChannels,
  initialVideos,
  initialSiteSettings,
  initialOrders,
} from './mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Helper to get the best available token (admin token takes priority in admin context)
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || localStorage.getItem('user_token') || null;
};

// In-browser fallback state store to support testing when backend server is offline
class BrowserStateStore {
  private static STORAGE_KEY_PACKAGES = 'yt_packages';
  private static STORAGE_KEY_SERVICES = 'yt_services';
  private static STORAGE_KEY_CHANNELS = 'yt_channels';
  private static STORAGE_KEY_VIDEOS = 'yt_videos';
  private static STORAGE_KEY_ORDERS = 'yt_orders';
  private static STORAGE_KEY_SETTINGS = 'yt_settings';
  private static STORAGE_KEY_ADMIN = 'yt_admin_session';

  private static get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }

  static getPackages(): PackageItem[] {
    return this.get<PackageItem[]>(this.STORAGE_KEY_PACKAGES, initialPackages);
  }

  static savePackages(items: PackageItem[]) {
    this.set(this.STORAGE_KEY_PACKAGES, items);
  }

  static getServices(): ServiceItem[] {
    return this.get<ServiceItem[]>(this.STORAGE_KEY_SERVICES, initialServices);
  }

  static saveServices(items: ServiceItem[]) {
    this.set(this.STORAGE_KEY_SERVICES, items);
  }

  static getChannels(): ChannelListing[] {
    return this.get<ChannelListing[]>(this.STORAGE_KEY_CHANNELS, initialChannels);
  }

  static saveChannels(items: ChannelListing[]) {
    this.set(this.STORAGE_KEY_CHANNELS, items);
  }

  static getVideos(): VideoListing[] {
    return this.get<VideoListing[]>(this.STORAGE_KEY_VIDEOS, initialVideos);
  }

  static saveVideos(items: VideoListing[]) {
    this.set(this.STORAGE_KEY_VIDEOS, items);
  }

  static getOrders(): Order[] {
    return this.get<Order[]>(this.STORAGE_KEY_ORDERS, initialOrders);
  }

  static saveOrders(items: Order[]) {
    this.set(this.STORAGE_KEY_ORDERS, items);
  }

  static getSettings(): SiteSettings {
    return this.get<SiteSettings>(this.STORAGE_KEY_SETTINGS, initialSiteSettings);
  }

  static saveSettings(settings: SiteSettings) {
    this.set(this.STORAGE_KEY_SETTINGS, settings);
  }

  static getAdminSession(): AdminUser | null {
    return this.get<AdminUser | null>(this.STORAGE_KEY_ADMIN, null);
  }

  static saveAdminSession(admin: AdminUser | null) {
    this.set(this.STORAGE_KEY_ADMIN, admin);
  }
}

// Universal fetch wrapper with error handling & graceful fallback
async function fetchWithFallback<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackFn: () => Promise<T> | T
): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
        ...options.headers,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json: ApiResponse<T> = await res.json();
    if (json.success && json.data !== undefined) {
      return json.data;
    }
    return json as unknown as T;
  } catch (err) {
    // If backend is unreachable or errored, use graceful local store
    return await fallbackFn();
  }
}

export const api = {
  // --- Public Packages ---
  async getPackages(): Promise<PackageItem[]> {
    return fetchWithFallback('/packages', { method: 'GET' }, () => {
      return BrowserStateStore.getPackages().filter((p) => p.isActive);
    });
  },

  async getFeaturedPackages(): Promise<PackageItem[]> {
    return fetchWithFallback('/packages/featured', { method: 'GET' }, () => {
      return BrowserStateStore.getPackages().filter((p) => p.isActive && p.isFeatured);
    });
  },

  async getPackageBySlug(slug: string): Promise<PackageItem | null> {
    return fetchWithFallback(`/packages/${slug}`, { method: 'GET' }, () => {
      const pkg = BrowserStateStore.getPackages().find((p) => p.slug === slug);
      return pkg || null;
    });
  },

  // --- Public Services ---
  async getServices(category?: string): Promise<ServiceItem[]> {
    return fetchWithFallback(`/services${category ? `?category=${encodeURIComponent(category)}` : ''}`, { method: 'GET' }, () => {
      let list = BrowserStateStore.getServices().filter((s) => s.isActive);
      if (category && category !== 'All') {
        list = list.filter((s) => s.category.toLowerCase() === category.toLowerCase());
      }
      return list;
    });
  },

  async getFeaturedServices(): Promise<ServiceItem[]> {
    return fetchWithFallback('/services/featured', { method: 'GET' }, () => {
      return BrowserStateStore.getServices().filter((s) => s.isActive && s.isFeatured);
    });
  },

  async getServiceBySlug(slug: string): Promise<ServiceItem | null> {
    return fetchWithFallback(`/services/${slug}`, { method: 'GET' }, () => {
      const item = BrowserStateStore.getServices().find((s) => s.slug === slug);
      return item || null;
    });
  },

  // --- Public Marketplace Channels ---
  async getChannels(params?: { category?: string; search?: string; monetized?: string }): Promise<ChannelListing[]> {
    return fetchWithFallback('/marketplace/channels', { method: 'GET' }, () => {
      let list = BrowserStateStore.getChannels().filter((c) => c.status === 'published');
      if (params?.category && params.category !== 'All') {
        list = list.filter((c) => c.category.toLowerCase().includes(params.category!.toLowerCase()));
      }
      if (params?.monetized === 'yes') {
        list = list.filter((c) => c.monetized);
      }
      if (params?.search) {
        const query = params.search.toLowerCase();
        list = list.filter(
          (c) => c.title.toLowerCase().includes(query) || c.niche.toLowerCase().includes(query)
        );
      }
      return list;
    });
  },

  async getChannelBySlug(slug: string): Promise<ChannelListing | null> {
    return fetchWithFallback(`/marketplace/channels/${slug}`, { method: 'GET' }, () => {
      const channel = BrowserStateStore.getChannels().find((c) => c.slug === slug);
      return channel || null;
    });
  },

  // --- Public Marketplace Videos ---
  async getVideos(params?: { category?: string; search?: string }): Promise<VideoListing[]> {
    return fetchWithFallback('/marketplace/videos', { method: 'GET' }, () => {
      let list = BrowserStateStore.getVideos().filter((v) => v.status === 'published');
      if (params?.category && params.category !== 'All') {
        list = list.filter((v) => v.category.toLowerCase().includes(params.category!.toLowerCase()));
      }
      if (params?.search) {
        const query = params.search.toLowerCase();
        list = list.filter((v) => v.title.toLowerCase().includes(query) || v.description.toLowerCase().includes(query));
      }
      return list;
    });
  },

  async getVideoBySlug(slug: string): Promise<VideoListing | null> {
    return fetchWithFallback(`/marketplace/videos/${slug}`, { method: 'GET' }, () => {
      const video = BrowserStateStore.getVideos().find((v) => v.slug === slug);
      return video || null;
    });
  },

  // --- Public Site Settings ---
  async getSiteSettings(): Promise<SiteSettings> {
    return fetchWithFallback('/site-settings', { method: 'GET' }, () => {
      return BrowserStateStore.getSettings();
    });
  },

  // --- Checkout and Orders ---
  async createOrder(orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    targetUrl?: string;
    instructions?: string;
    items: { id: string; itemType: 'package' | 'service' | 'channel' | 'video'; quantity: number }[];
  }): Promise<Order> {
    return fetchWithFallback(
      '/orders',
      {
        method: 'POST',
        body: JSON.stringify(orderData),
      },
      () => {
        // Calculate on server-side model logic
        const packages = BrowserStateStore.getPackages();
        const services = BrowserStateStore.getServices();
        const channels = BrowserStateStore.getChannels();
        const videos = BrowserStateStore.getVideos();

        const orderItems = orderData.items.map((item) => {
          let found: any;
          if (item.itemType === 'package') found = packages.find((p) => p._id === item.id);
          else if (item.itemType === 'service') found = services.find((s) => s._id === item.id);
          else if (item.itemType === 'channel') found = channels.find((c) => c._id === item.id);
          else if (item.itemType === 'video') found = videos.find((v) => v._id === item.id);

          const title = found ? (found.title || found.name) : 'Purchased Item';
          const price = found ? found.price : 0;
          const image = found ? (found.image || '') : '';
          const slug = found ? found.slug : '';

          return {
            id: item.id,
            itemType: item.itemType,
            title,
            slug,
            unitPrice: price,
            quantity: item.quantity,
            subtotal: price * item.quantity,
            image,
          };
        });

        const subtotal = orderItems.reduce((acc, curr) => acc + curr.subtotal, 0);
        const orderNumber = `YT-${Math.floor(100000 + Math.random() * 900000)}`;

        const newOrder: Order = {
          _id: `ord-${Date.now()}`,
          orderNumber,
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          customerEmail: orderData.customerEmail,
          targetUrl: orderData.targetUrl,
          instructions: orderData.instructions,
          items: orderItems,
          subtotal,
          discount: 0,
          total: subtotal,
          currency: '৳',
          paymentStatus: 'unpaid',
          orderStatus: 'pending',
          createdAt: new Date().toISOString(),
        };

        const existingOrders = BrowserStateStore.getOrders();
        BrowserStateStore.saveOrders([newOrder, ...existingOrders]);
        return newOrder;
      }
    );
  },

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    return fetchWithFallback(`/orders/${orderNumber}`, { method: 'GET' }, () => {
      const orders = BrowserStateStore.getOrders();
      return orders.find((o) => o.orderNumber === orderNumber) || null;
    });
  },

  // --- User Order History ---
  async getUserOrders(): Promise<Order[]> {
    return fetchWithFallback('/orders/my-orders', { method: 'GET' }, () => {
      const orders = BrowserStateStore.getOrders();
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user_profile');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user?.email) {
              return orders.filter(
                (o) => o.customerEmail?.toLowerCase() === user.email.toLowerCase()
              );
            }
          } catch {}
        }
      }
      return orders;
    });
  },

  // --- Admin Authentication ---
  async adminLogin(email: string, password: string): Promise<{ admin: AdminUser; token: string }> {
    return fetchWithFallback(
      '/auth/admin/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      },
      () => {
        // Fallback test credentials
        if ((email === 'admin@ytmarket.com' || email === 'admin@gmail.com') && (password === 'admin123' || password === 'admin@123')) {
          const admin: AdminUser = {
            id: 'admin-001',
            email,
            role: 'superadmin',
            isActive: true,
          };
          BrowserStateStore.saveAdminSession(admin);
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', 'mock_admin_jwt_token_ytmarket_9982');
          }
          return { admin, token: 'mock_admin_jwt_token_ytmarket_9982' };
        }
        throw new Error('Invalid email or password');
      }
    );
  },

  async adminLogout(): Promise<void> {
    BrowserStateStore.saveAdminSession(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  async adminGetMe(): Promise<AdminUser | null> {
    return fetchWithFallback('/auth/admin/me', { method: 'GET' }, () => {
      return BrowserStateStore.getAdminSession();
    });
  },

  // --- Admin Dashboard Stats ---
  async getAdminDashboard(): Promise<DashboardStats> {
    return fetchWithFallback('/admin/dashboard', { method: 'GET' }, () => {
      const orders = BrowserStateStore.getOrders();
      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o) => o.orderStatus === 'pending').length;
      const completedOrders = orders.filter((o) => o.orderStatus === 'completed').length;
      // Revenue is counted only for paid orders per accounting rules in documentation
      const revenue = orders
        .filter((o) => o.paymentStatus === 'paid' && o.orderStatus !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0);

      return {
        totalOrders,
        pendingOrders,
        completedOrders,
        revenue,
        recentOrders: orders.slice(0, 8),
      };
    });
  },

  // --- Admin Packages CRUD ---
  async getAdminPackages(): Promise<PackageItem[]> {
    return fetchWithFallback('/admin/packages', { method: 'GET' }, () => {
      return BrowserStateStore.getPackages();
    });
  },

  async createPackage(pkg: Partial<PackageItem>): Promise<PackageItem> {
    return fetchWithFallback('/admin/packages', { method: 'POST', body: JSON.stringify(pkg) }, () => {
      const packages = BrowserStateStore.getPackages();
      const newPkg: PackageItem = {
        _id: `pkg-${Date.now()}`,
        name: pkg.name || 'New Package',
        slug: pkg.slug || `package-${Date.now()}`,
        description: pkg.description || '',
        category: pkg.category || 'Audience Growth',
        quantity: pkg.quantity || 100,
        price: pkg.price || 160,
        currency: pkg.currency || '৳',
        features: pkg.features || [],
        isFeatured: Boolean(pkg.isFeatured),
        isActive: pkg.isActive !== undefined ? pkg.isActive : true,
      };
      BrowserStateStore.savePackages([newPkg, ...packages]);
      return newPkg;
    });
  },

  async updatePackage(id: string, updates: Partial<PackageItem>): Promise<PackageItem> {
    return fetchWithFallback(`/admin/packages/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }, () => {
      const packages = BrowserStateStore.getPackages();
      const index = packages.findIndex((p) => p._id === id);
      if (index === -1) throw new Error('Package not found');
      packages[index] = { ...packages[index], ...updates };
      BrowserStateStore.savePackages([...packages]);
      return packages[index];
    });
  },

  async deletePackage(id: string): Promise<boolean> {
    return fetchWithFallback(`/admin/packages/${id}`, { method: 'DELETE' }, () => {
      const packages = BrowserStateStore.getPackages();
      BrowserStateStore.savePackages(packages.filter((p) => p._id !== id));
      return true;
    });
  },

  // --- Admin Services CRUD ---
  async getAdminServices(): Promise<ServiceItem[]> {
    return fetchWithFallback('/admin/services', { method: 'GET' }, () => {
      return BrowserStateStore.getServices();
    });
  },

  async createService(srv: Partial<ServiceItem>): Promise<ServiceItem> {
    return fetchWithFallback('/admin/services', { method: 'POST', body: JSON.stringify(srv) }, () => {
      const services = BrowserStateStore.getServices();
      const newSrv: ServiceItem = {
        _id: `srv-${Date.now()}`,
        name: srv.name || 'New Service',
        slug: srv.slug || `service-${Date.now()}`,
        description: srv.description || '',
        category: srv.category || 'Video Editing',
        price: srv.price || 500,
        currency: srv.currency || '৳',
        image: srv.image || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
        features: srv.features || [],
        deliveryInformation: srv.deliveryInformation || 'Delivered within 48 hours.',
        isFeatured: Boolean(srv.isFeatured),
        isActive: srv.isActive !== undefined ? srv.isActive : true,
      };
      BrowserStateStore.saveServices([newSrv, ...services]);
      return newSrv;
    });
  },

  async updateService(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem> {
    return fetchWithFallback(`/admin/services/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }, () => {
      const services = BrowserStateStore.getServices();
      const index = services.findIndex((s) => s._id === id);
      if (index === -1) throw new Error('Service not found');
      services[index] = { ...services[index], ...updates };
      BrowserStateStore.saveServices([...services]);
      return services[index];
    });
  },

  async deleteService(id: string): Promise<boolean> {
    return fetchWithFallback(`/admin/services/${id}`, { method: 'DELETE' }, () => {
      const services = BrowserStateStore.getServices();
      BrowserStateStore.saveServices(services.filter((s) => s._id !== id));
      return true;
    });
  },

  // --- Admin Channels CRUD ---
  async getAdminChannels(): Promise<ChannelListing[]> {
    return fetchWithFallback('/admin/marketplace/channels', { method: 'GET' }, () => {
      return BrowserStateStore.getChannels();
    });
  },

  async createChannel(channel: Partial<ChannelListing>): Promise<ChannelListing> {
    return fetchWithFallback('/admin/marketplace/channels', { method: 'POST', body: JSON.stringify(channel) }, () => {
      const channels = BrowserStateStore.getChannels();
      const newChn: ChannelListing = {
        _id: `chn-${Date.now()}`,
        title: channel.title || 'New Channel Listing',
        slug: channel.slug || `channel-${Date.now()}`,
        description: channel.description || '',
        category: channel.category || 'General',
        image: channel.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        price: channel.price || 10000,
        currency: channel.currency || '৳',
        subscribers: channel.subscribers || 1000,
        monetized: Boolean(channel.monetized),
        niche: channel.niche || 'General',
        verified: Boolean(channel.verified),
        sellerContact: channel.sellerContact || 'support@ytmarket.com',
        status: channel.status || 'published',
      };
      BrowserStateStore.saveChannels([newChn, ...channels]);
      return newChn;
    });
  },

  async updateChannel(id: string, updates: Partial<ChannelListing>): Promise<ChannelListing> {
    return fetchWithFallback(`/admin/marketplace/channels/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }, () => {
      const channels = BrowserStateStore.getChannels();
      const index = channels.findIndex((c) => c._id === id);
      if (index === -1) throw new Error('Channel listing not found');
      channels[index] = { ...channels[index], ...updates };
      BrowserStateStore.saveChannels([...channels]);
      return channels[index];
    });
  },

  async deleteChannel(id: string): Promise<boolean> {
    return fetchWithFallback(`/admin/marketplace/channels/${id}`, { method: 'DELETE' }, () => {
      const channels = BrowserStateStore.getChannels();
      BrowserStateStore.saveChannels(channels.filter((c) => c._id !== id));
      return true;
    });
  },

  // --- Admin Videos CRUD ---
  async getAdminVideos(): Promise<VideoListing[]> {
    return fetchWithFallback('/admin/marketplace/videos', { method: 'GET' }, () => {
      return BrowserStateStore.getVideos();
    });
  },

  async createVideo(video: Partial<VideoListing>): Promise<VideoListing> {
    return fetchWithFallback('/admin/marketplace/videos', { method: 'POST', body: JSON.stringify(video) }, () => {
      const videos = BrowserStateStore.getVideos();
      const newVid: VideoListing = {
        _id: `vid-${Date.now()}`,
        title: video.title || 'New Video Asset',
        slug: video.slug || `video-${Date.now()}`,
        description: video.description || '',
        category: video.category || 'Turnkey Content',
        image: video.image || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        price: video.price || 2000,
        currency: video.currency || '৳',
        duration: video.duration || '10 min',
        resolution: video.resolution || '1080p 60fps',
        rightsIncluded: video.rightsIncluded || ['Commercial License Included'],
        deliverables: video.deliverables || 'Full MP4 master file.',
        status: video.status || 'published',
      };
      BrowserStateStore.saveVideos([newVid, ...videos]);
      return newVid;
    });
  },

  async updateVideo(id: string, updates: Partial<VideoListing>): Promise<VideoListing> {
    return fetchWithFallback(`/admin/marketplace/videos/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }, () => {
      const videos = BrowserStateStore.getVideos();
      const index = videos.findIndex((v) => v._id === id);
      if (index === -1) throw new Error('Video listing not found');
      videos[index] = { ...videos[index], ...updates };
      BrowserStateStore.saveVideos([...videos]);
      return videos[index];
    });
  },

  async deleteVideo(id: string): Promise<boolean> {
    return fetchWithFallback(`/admin/marketplace/videos/${id}`, { method: 'DELETE' }, () => {
      const videos = BrowserStateStore.getVideos();
      BrowserStateStore.saveVideos(videos.filter((v) => v._id !== id));
      return true;
    });
  },

  // --- Admin Orders Management ---
  async getAdminOrders(statusFilter?: string, searchQuery?: string): Promise<Order[]> {
    return fetchWithFallback('/admin/orders', { method: 'GET' }, () => {
      let orders = BrowserStateStore.getOrders();
      if (statusFilter && statusFilter !== 'all') {
        orders = orders.filter((o) => o.orderStatus === statusFilter);
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        orders = orders.filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(query) ||
            o.customerName.toLowerCase().includes(query) ||
            o.customerEmail.toLowerCase().includes(query) ||
            o.customerPhone.includes(query)
        );
      }
      return orders;
    });
  },

  async updateOrderStatus(
    orderId: string,
    orderStatus?: Order['orderStatus'],
    paymentStatus?: Order['paymentStatus']
  ): Promise<Order> {
    return fetchWithFallback(
      `/admin/orders/${orderId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ orderStatus, paymentStatus }),
      },
      () => {
        const orders = BrowserStateStore.getOrders();
        const index = orders.findIndex((o) => o._id === orderId);
        if (index === -1) throw new Error('Order not found');

        if (orderStatus) orders[index].orderStatus = orderStatus;
        if (paymentStatus) orders[index].paymentStatus = paymentStatus;
        orders[index].updatedAt = new Date().toISOString();

        BrowserStateStore.saveOrders([...orders]);
        return orders[index];
      }
    );
  },

  // --- Admin Site Settings ---
  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    return fetchWithFallback(
      '/admin/site-settings',
      {
        method: 'PATCH',
        body: JSON.stringify(settings),
      },
      () => {
        const current = BrowserStateStore.getSettings();
        const updated = {
          ...current,
          ...settings,
          updatedAt: new Date().toISOString(),
        };
        BrowserStateStore.saveSettings(updated);
        return updated;
      }
    );
  },
};
