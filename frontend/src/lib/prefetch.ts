import { queryClient } from './queryClient';
import { api } from './api';

export const QUERY_KEYS = {
  PACKAGES: 'packages',
  PACKAGES_FEATURED: 'packages:featured',
  SERVICES: 'services',
  SERVICES_FEATURED: 'services:featured',
  CHANNELS: 'marketplace:channels',
  VIDEOS: 'marketplace:videos',
  SITE_SETTINGS: 'site-settings',
  PACKAGE_DETAIL: (slug: string) => `packages:${slug}`,
  SERVICE_DETAIL: (slug: string) => `services:${slug}`,
  CHANNEL_DETAIL: (slug: string) => `marketplace:channels:${slug}`,
  VIDEO_DETAIL: (slug: string) => `marketplace:videos:${slug}`,
} as const;

/**
 * High-performance prefetch functions to warm the cache before user navigation
 */
export const prefetch = {
  packages: () => queryClient.prefetchQuery(QUERY_KEYS.PACKAGES, () => api.getPackages()),
  featuredPackages: () => queryClient.prefetchQuery(QUERY_KEYS.PACKAGES_FEATURED, () => api.getFeaturedPackages()),
  services: () => queryClient.prefetchQuery(QUERY_KEYS.SERVICES, () => api.getServices()),
  featuredServices: () => queryClient.prefetchQuery(QUERY_KEYS.SERVICES_FEATURED, () => api.getFeaturedServices()),
  channels: () => queryClient.prefetchQuery(QUERY_KEYS.CHANNELS, () => api.getChannels()),
  videos: () => queryClient.prefetchQuery(QUERY_KEYS.VIDEOS, () => api.getVideos()),
  siteSettings: () => queryClient.prefetchQuery(QUERY_KEYS.SITE_SETTINGS, () => api.getSiteSettings()),

  packageDetail: (slug: string) =>
    queryClient.prefetchQuery(QUERY_KEYS.PACKAGE_DETAIL(slug), () => api.getPackageBySlug(slug)),
  serviceDetail: (slug: string) =>
    queryClient.prefetchQuery(QUERY_KEYS.SERVICE_DETAIL(slug), () => api.getServiceBySlug(slug)),
  channelDetail: (slug: string) =>
    queryClient.prefetchQuery(QUERY_KEYS.CHANNEL_DETAIL(slug), () => api.getChannelBySlug(slug)),
  videoDetail: (slug: string) =>
    queryClient.prefetchQuery(QUERY_KEYS.VIDEO_DETAIL(slug), () => api.getVideoBySlug(slug)),

  /**
   * Prefetch all primary public catalog categories in the background
   */
  allPublicCatalogs: () => {
    // Stagger slightly to avoid saturating network on initial render
    prefetch.packages();
    setTimeout(() => prefetch.featuredServices(), 100);
    setTimeout(() => prefetch.channels(), 250);
    setTimeout(() => prefetch.videos(), 400);
    setTimeout(() => prefetch.siteSettings(), 500);
  },
};

