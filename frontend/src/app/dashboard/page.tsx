'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '@/context/UserAuthContext';
import { useAuth } from '@/context/AuthContext';

export default function DashboardIndexPage() {
  const router = useRouter();
  const { user, isAuthenticated: isUserAuth, isLoading: userLoading } = useUserAuth();
  const { admin, isAuthenticated: isAdminAuth, isLoading: adminLoading } = useAuth();

  useEffect(() => {
    if (!userLoading && !adminLoading) {
      if (isAdminAuth || admin || user?.role === 'admin' || user?.role === 'superadmin' || user?.isAdmin) {
        router.replace('/dashboard/admin');
      } else if (isUserAuth && user) {
        router.replace('/dashboard/user');
      } else {
        router.replace('/login');
      }
    }
  }, [userLoading, adminLoading, isUserAuth, isAdminAuth, user, admin, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050B14]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-xs">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
