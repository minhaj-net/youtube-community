'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  isAdmin?: boolean;
}

interface UserAuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const USER_TOKEN_KEY = 'user_token';
const USER_PROFILE_KEY = 'user_profile';

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem(USER_TOKEN_KEY);
    const profile = localStorage.getItem(USER_PROFILE_KEY);
    if (token && profile) {
      try {
        setUser(JSON.parse(profile));
      } catch {
        localStorage.removeItem(USER_TOKEN_KEY);
        localStorage.removeItem(USER_PROFILE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/auth/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }
    const { token, user: profile, isAdmin, role } = data.data;
    const finalRole = role || (isAdmin ? 'superadmin' : 'user');
    const isAdministrator = !!isAdmin || finalRole === 'admin' || finalRole === 'superadmin';

    const userWithRole: UserProfile = {
      ...profile,
      role: finalRole,
      isAdmin: isAdministrator,
    };

    localStorage.setItem(USER_TOKEN_KEY, token);
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userWithRole));

    // If account has administrator privileges, also initialize admin session
      if (isAdministrator) {
        localStorage.setItem('token', token);
        localStorage.setItem(
          'yt_admin_session',
          JSON.stringify({
            id: profile.id,
            email: profile.email,
            role: finalRole,
            isActive: true,
          })
        );
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('yt_admin_session');
      }

      setUser(userWithRole);
      return { ...data.data, role: finalRole, isAdmin: isAdministrator };
    };

    const register = async (name: string, email: string, phone: string, password: string) => {
      const res = await fetch(`${API_BASE_URL}/auth/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }
      const { token, user: profile } = data.data;
      const userWithRole: UserProfile = {
        ...profile,
        role: 'user',
        isAdmin: false,
      };
      localStorage.setItem(USER_TOKEN_KEY, token);
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userWithRole));
      localStorage.removeItem('token');
      localStorage.removeItem('yt_admin_session');
      setUser(userWithRole);
    };

    const logout = async () => {
      try {
        const token = localStorage.getItem(USER_TOKEN_KEY);
        if (token) {
          await fetch(`${API_BASE_URL}/auth/user/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }).catch(() => { });
        }
      } catch {
        // ignore network errors on logout
      } finally {
        // Completely remove authentication tokens and cached user profile
        localStorage.removeItem(USER_TOKEN_KEY);
        localStorage.removeItem(USER_PROFILE_KEY);
        localStorage.removeItem('token');
        localStorage.removeItem('yt_admin_session');
        sessionStorage.clear();

        // Reset state
        setUser(null);

        // Force location replace to clear in-memory cache and prevent back-navigation to protected pages
        if (typeof window !== 'undefined') {
          window.location.replace('/login?logged_out=true');
        } else {
          router.push('/login');
        }
      }
    };

    return (
      <UserAuthContext.Provider
        value={{
          user,
          isLoading,
          isAuthenticated: !!user,
          login,
          register,
          logout,
        }}
      >
        {children}
      </UserAuthContext.Provider>
    );
  }

  export function useUserAuth() {
    const ctx = useContext(UserAuthContext);
    if (!ctx) throw new Error('useUserAuth must be used within UserAuthProvider');
    return ctx;
  }

