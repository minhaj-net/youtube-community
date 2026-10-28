export type Currency = 'BDT' | 'USD';

export interface PackageItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  currency: string;
  image?: string;
  features: string[];
  isFeatured: boolean;
  isActive: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  image: string;
  features: string[];
  deliveryInformation?: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChannelListing {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  image: string;
  price: number;
  currency: string;
  subscribers: number;
  monthlyViews?: number;
  monetized: boolean;
  niche: string;
  verified?: boolean;
  sellerContact?: string;
  status: 'published' | 'draft' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export interface VideoListing {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  image: string;
  price: number;
  currency: string;
  duration?: string;
  resolution?: string;
  rightsIncluded: string[];
  deliverables?: string;
  status: 'published' | 'draft' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string; // unique item id (_id)
  itemType: 'package' | 'service' | 'channel' | 'video';
  title: string;
  slug: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  maxQuantity?: number;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';

export interface OrderLineItem {
  id: string;
  itemType: 'package' | 'service' | 'channel' | 'video';
  title: string;
  slug: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  targetUrl?: string; // YouTube Channel or Video URL
  instructions?: string;
  items: OrderLineItem[];
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface SiteSettings {
  logoUrl?: string;
  footerPhone: string;
  footerEmail: string;
  whatsAppNumber: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  revenue: number;
  recentOrders: Order[];
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}
