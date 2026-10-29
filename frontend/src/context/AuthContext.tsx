'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('user_token');
        if (!token) {
          setAdmin(null);
          setIsLoading(false);
          return;
        }
        const user = await api.adminGetMe();
          if (user && (user.role === 'admin' || user.role === 'superadmin')) {
            setAdmin(user);
          } else {
            setAdmin(null);
          }
        } catch {
          setAdmin(null);
        } finally {
          setIsLoading(false);
        }
      }
    checkAuth();
    }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.adminLogin(email, pass);
    if (res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user_token', res.token);
      localStorage.setItem('yt_admin_session', JSON.stringify(res.admin));
      localStorage.setItem(
        'user_profile',
        JSON.stringify({
          id: res.admin.id,
          name: 'Administrator',
          email: res.admin.email,
          role: res.admin.role,
          isAdmin: true,
        })
      );
    }
    setAdmin(res.admin);
  };

  const logout = async () => {
    try {
      await api.adminLogout();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_profile');
      localStorage.removeItem('yt_admin_session');
      sessionStorage.clear();
      setAdmin(null);
      if (typeof window !== 'undefined') {
        window.location.replace('/admin/login?logged_out=true');
      } else {
        router.push('/admin/login');
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isLoading,
        login,
        logout,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
