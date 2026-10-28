import {
  PackageItem,
  ServiceItem,
  ChannelListing,
  VideoListing,
  SiteSettings,
  Order,
  DashboardStats,
  AdminUser,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Helper to get authentication token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || localStorage.getItem('user_token') || null;
};

// Pure fetch wrapper with strict API validation and NO mock or local storage business data fallbacks
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    // Non-JSON response
  }

  if (!res.ok) {
    const errorMsg = json?.message || `HTTP ${res.status}: ${res.statusText || 'Request failed'}`;
    throw new Error(errorMsg);
  }

  if (json && typeof json === 'object') {
    if (json.success === false) {
      throw new Error(json.message || 'API request returned failure');
    }
    if (json.data !== undefined) {
      return json.data as T;
    }
  }

  return json as T;
}

export const api = {
  // --- Public Packages ---
  async getPackages(): Promise<PackageItem[]> {
    return apiFetch<PackageItem[]>('/packages');
  },

  async getFeaturedPackages(): Promise<PackageItem[]> {
    return apiFetch<PackageItem[]>('/packages/featured');
  },

  async getPackageBySlug(slug: string): Promise<PackageItem | null> {
    try {
      return await apiFetch<PackageItem>(`/packages/${encodeURIComponent(slug)}`);
    } catch (err: any) {
      if (err?.message?.includes('404') || err?.message?.toLowerCase().includes('not found')) {
        return null;
      }
      throw err;
    }
  },

  // --- Public Services ---
  async getServices(category?: string): Promise<ServiceItem[]> {
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    return apiFetch<ServiceItem[]>(`/services${query}`);
  },

  async getFeaturedServices(): Promise<ServiceItem[]> {
    return apiFetch<ServiceItem[]>('/services/featured');
  },

  async getServiceBySlug(slug: string): Promise<ServiceItem | null> {
    try {
      return await apiFetch<ServiceItem>(`/services/${encodeURIComponent(slug)}`);
    } catch (err: any) {
      if (err?.message?.includes('404') || err?.message?.toLowerCase().includes('not found')) {
        return null;
      }
      throw err;
    }
  },

  // --- Public Marketplace Channels ---
  async getChannels(params?: { category?: string; search?: string; monetized?: string }): Promise<ChannelListing[]> {
    const queryParams = new URLSearchParams();
    if (params?.category && params.category !== 'All') {
      queryParams.append('category', params.category);
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.monetized) {
      queryParams.append('monetized', params.monetized);
    }
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiFetch<ChannelListing[]>(`/marketplace/channels${queryString}`);
  },

  async getChannelBySlug(slug: string): Promise<ChannelListing | null> {
    try {
      return await apiFetch<ChannelListing>(`/marketplace/channels/${encodeURIComponent(slug)}`);
    } catch (err: any) {
      if (err?.message?.includes('404') || err?.message?.toLowerCase().includes('not found')) {
        return null;
      }
      throw err;
    }
  },

  // --- Public Marketplace Videos ---
  async getVideos(params?: { category?: string; search?: string }): Promise<VideoListing[]> {
    const queryParams = new URLSearchParams();
    if (params?.category && params.category !== 'All') {
      queryParams.append('category', params.category);
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiFetch<VideoListing[]>(`/marketplace/videos${queryString}`);
  },

  async getVideoBySlug(slug: string): Promise<VideoListing | null> {
    try {
      return await apiFetch<VideoListing>(`/marketplace/videos/${encodeURIComponent(slug)}`);
    } catch (err: any) {
      if (err?.message?.includes('404') || err?.message?.toLowerCase().includes('not found')) {
        return null;
      }
      throw err;
    }
  },

  // --- Public Site Settings ---
  async getSiteSettings(): Promise<SiteSettings> {
    return apiFetch<SiteSettings>('/site-settings');
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
    return apiFetch<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    try {
      return await apiFetch<Order>(`/orders/${encodeURIComponent(orderNumber)}`);
    } catch (err: any) {
      if (err?.message?.includes('404') || err?.message?.toLowerCase().includes('not found')) {
        return null;
      }
      throw err;
    }
  },

  // --- User Order History ---
  async getUserOrders(): Promise<Order[]> {
    return apiFetch<Order[]>('/orders/my-orders');
  },

  // --- Admin Authentication ---
  async adminLogin(email: string, password: string): Promise<{ admin: AdminUser; token: string }> {
    return apiFetch<{ admin: AdminUser; token: string }>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async adminLogout(): Promise<void> {
    try {
      await apiFetch<void>('/auth/admin/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
  },

  async adminGetMe(): Promise<AdminUser | null> {
    try {
      return await apiFetch<AdminUser>('/auth/admin/me');
    } catch {
      return null;
    }
  },

  // --- Admin Dashboard Stats ---
  async getAdminDashboard(): Promise<DashboardStats> {
    return apiFetch<DashboardStats>('/admin/dashboard');
  },

  // --- Admin Packages CRUD ---
  async getAdminPackages(): Promise<PackageItem[]> {
    return apiFetch<PackageItem[]>('/admin/packages');
  },

  async createPackage(pkg: Partial<PackageItem>): Promise<PackageItem> {
    return apiFetch<PackageItem>('/admin/packages', {
      method: 'POST',
      body: JSON.stringify(pkg),
    });
  },

  async updatePackage(id: string, updates: Partial<PackageItem>): Promise<PackageItem> {
    return apiFetch<PackageItem>(`/admin/packages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deletePackage(id: string): Promise<boolean> {
    await apiFetch<any>(`/admin/packages/${id}`, {
      method: 'DELETE',
    });
    return true;
  },

  // --- Admin Services CRUD ---
  async getAdminServices(): Promise<ServiceItem[]> {
    return apiFetch<ServiceItem[]>('/admin/services');
  },

  async createService(srv: Partial<ServiceItem>): Promise<ServiceItem> {
    return apiFetch<ServiceItem>('/admin/services', {
      method: 'POST',
      body: JSON.stringify(srv),
    });
  },

  async updateService(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem> {
    return apiFetch<ServiceItem>(`/admin/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteService(id: string): Promise<boolean> {
    await apiFetch<any>(`/admin/services/${id}`, {
      method: 'DELETE',
    });
    return true;
  },

  // --- Admin Channels CRUD ---
  async getAdminChannels(search?: string): Promise<ChannelListing[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiFetch<ChannelListing[]>(`/admin/marketplace/channels${query}`);
  },

  async createChannel(channel: Partial<ChannelListing>): Promise<ChannelListing> {
    return apiFetch<ChannelListing>('/admin/marketplace/channels', {
      method: 'POST',
      body: JSON.stringify(channel),
    });
  },

  async updateChannel(id: string, updates: Partial<ChannelListing>): Promise<ChannelListing> {
    return apiFetch<ChannelListing>(`/admin/marketplace/channels/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteChannel(id: string): Promise<boolean> {
    await apiFetch<any>(`/admin/marketplace/channels/${id}`, {
      method: 'DELETE',
    });
    return true;
  },

  // --- Admin Videos CRUD ---
  async getAdminVideos(search?: string): Promise<VideoListing[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiFetch<VideoListing[]>(`/admin/marketplace/videos${query}`);
  },

  async createVideo(video: Partial<VideoListing>): Promise<VideoListing> {
    return apiFetch<VideoListing>('/admin/marketplace/videos', {
      method: 'POST',
      body: JSON.stringify(video),
    });
  },

  async updateVideo(id: string, updates: Partial<VideoListing>): Promise<VideoListing> {
    return apiFetch<VideoListing>(`/admin/marketplace/videos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteVideo(id: string): Promise<boolean> {
    await apiFetch<any>(`/admin/marketplace/videos/${id}`, {
      method: 'DELETE',
    });
    return true;
  },

  // --- Admin Orders Management ---
  async getAdminOrders(statusFilter?: string, searchQuery?: string): Promise<Order[]> {
    const queryParams = new URLSearchParams();
    if (statusFilter && statusFilter !== 'all') {
      queryParams.append('status', statusFilter);
    }
    if (searchQuery) {
      queryParams.append('search', searchQuery);
    }
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const res = await apiFetch<any>(`/admin/orders${query}`);
    return Array.isArray(res) ? res : res?.orders || [];
  },

  async updateOrderStatus(
    orderId: string,
    orderStatus?: Order['orderStatus'],
    paymentStatus?: Order['paymentStatus'],
    note?: string
  ): Promise<Order> {
    return apiFetch<Order>(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ orderStatus, paymentStatus, note }),
    });
  },

  // --- Admin Site Settings ---
  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    return apiFetch<SiteSettings>('/admin/site-settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  },
};
