'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  error: Error | null;
  isFetching: boolean;
}

class QueryClient {
  private cache = new Map<string, CacheEntry>();
  private inFlight = new Map<string, Promise<any>>();
  private listeners = new Map<string, Set<() => void>>();

  // Default stale time: 3 minutes; default cache time: 30 minutes
  public defaultStaleTime = 3 * 60 * 1000;
  public defaultCacheTime = 30 * 60 * 1000;

  /**
   * Subscribe to cache changes for a given key
   */
  subscribe(key: string, listener: () => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    const set = this.listeners.get(key)!;
    set.add(listener);

    return () => {
      set.delete(listener);
      if (set.size === 0) {
        this.listeners.delete(key);
      }
    };
  }

  private notify(key: string) {
    const set = this.listeners.get(key);
    if (set) {
      set.forEach((listener) => {
        try {
          listener();
        } catch {
          // ignore listener errors
        }
      });
    }
  }

  /**
   * Get cached data synchronously
   */
  getQueryData<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    return entry?.data as T | undefined;
  }

  /**
   * Get the full cache entry (data, timestamp, error, isFetching)
   */
  getEntry<T>(key: string): CacheEntry<T> | undefined {
    return this.cache.get(key) as CacheEntry<T> | undefined;
  }

  /**
   * Check if a query entry is stale
   */
  isStale(key: string, staleTime: number = this.defaultStaleTime): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;
    return Date.now() - entry.timestamp > staleTime;
  }

  /**
   * Fetch a query with request deduplication and caching
   */
  async fetchQuery<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: { staleTime?: number; force?: boolean }
  ): Promise<T> {
    const staleTime = options?.staleTime ?? this.defaultStaleTime;
    const force = options?.force ?? false;
    const existing = this.cache.get(key);

    // Return fresh cached data if valid and not forced
    if (!force && existing && !this.isStale(key, staleTime)) {
      return existing.data as T;
    }

    // Deduplicate in-flight requests for the same key
    if (this.inFlight.has(key)) {
      return this.inFlight.get(key) as Promise<T>;
    }

    // Mark as fetching in cache
    if (existing) {
      existing.isFetching = true;
      this.notify(key);
    }

    const promise = (async () => {
      try {
        const data = await fetcher();
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
          error: null,
          isFetching: false,
        });
        this.notify(key);
        return data;
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(String(err));
        if (this.cache.has(key)) {
          const prev = this.cache.get(key)!;
          prev.error = error;
          prev.isFetching = false;
        } else {
          this.cache.set(key, {
            data: null as any,
            timestamp: 0,
            error,
            isFetching: false,
          });
        }
        this.notify(key);
        throw error;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }

  /**
   * Prefetch a query in the background without throwing errors
   */
  async prefetchQuery<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: { staleTime?: number }
  ): Promise<void> {
    try {
      await this.fetchQuery(key, fetcher, options);
    } catch {
      // Prefetch silently ignores failures so navigation isn't affected
    }
  }

  /**
   * Invalidate queries matching a prefix (e.g. 'packages', 'services')
   */
  invalidateQueries(keyPrefix?: string): void {
    if (!keyPrefix) {
      this.cache.clear();
      this.listeners.forEach((set) => set.forEach((l) => l()));
      return;
    }

    for (const [key, entry] of this.cache.entries()) {
      if (key.startsWith(keyPrefix)) {
        entry.timestamp = 0; // Mark stale
        this.notify(key);
      }
    }
  }

  /**
   * Set query data manually
   */
  setQueryData<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      error: null,
      isFetching: false,
    });
    this.notify(key);
  }
}

// Global QueryClient instance
export const queryClient = new QueryClient();

export interface UseQueryOptions<T> {
  staleTime?: number;
  enabled?: boolean;
  initialData?: T;
}

export interface UseQueryResult<T> {
  data: T;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<T>;
}

/**
 * Custom React 19 / Next.js hook for data fetching with SWR, caching & deduplication
 */
export function useQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: UseQueryOptions<T>
): UseQueryResult<T> {
  const staleTime = options?.staleTime ?? queryClient.defaultStaleTime;
  const enabled = options?.enabled !== false;

  // Read current cached state synchronously
  const entry = queryClient.getEntry<T>(key);
  const initialData = entry?.data ?? options?.initialData;

  const [data, setData] = useState<T>(initialData as T);
  const [error, setError] = useState<Error | null>(entry?.error ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData && enabled);
  const [isFetching, setIsFetching] = useState<boolean>(Boolean(entry?.isFetching));

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const executeFetch = useCallback(
    async (force = false) => {
      if (!enabled) return;
      setIsFetching(true);
      try {
        const result = await queryClient.fetchQuery<T>(key, () => fetcherRef.current(), {
          staleTime,
          force,
        });
        setData(result);
        setError(null);
        return result;
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error(String(err)));
        throw err;
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    },
    [key, enabled, staleTime]
  );

  useEffect(() => {
    // Sync with cache when key changes
    const currentEntry = queryClient.getEntry<T>(key);
    if (currentEntry?.data !== undefined) {
      setData(currentEntry.data);
      setError(currentEntry.error);
      setIsLoading(false);
    } else if (enabled) {
      setIsLoading(true);
    }

    // Subscribe to cache changes
    const unsubscribe = queryClient.subscribe(key, () => {
      const updated = queryClient.getEntry<T>(key);
      if (updated) {
        if (updated.data !== undefined) setData(updated.data);
        setError(updated.error);
        setIsFetching(updated.isFetching);
        if (updated.data !== undefined || updated.error !== null) {
          setIsLoading(false);
        }
      }
    });

    // If data is stale or missing, revalidate in background
    if (enabled && queryClient.isStale(key, staleTime)) {
      executeFetch(false).catch(() => {});
    }

    return unsubscribe;
  }, [key, enabled, staleTime, executeFetch]);

  const refetch = useCallback(() => executeFetch(true) as Promise<T>, [executeFetch]);

  return {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  };
}

