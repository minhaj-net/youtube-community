'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

  export default function AdminPageRedirect() {
    const router = useRouter();

    useEffect(() => {
    router.replace('/dashboard/admin');
  }, [router]);

  return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin" />
      </div>
      );
}
