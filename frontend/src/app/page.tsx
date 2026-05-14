'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import LoginPage from './auth/login/page';

export default function Home() {
  const { isAuthenticated, user, hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      if (user?.role === 'OWNER') {
        router.push('/dashboard');
      } else {
        router.push('/tenant/dashboard');
      }
    }
  }, [isAuthenticated, hasHydrated, user, router]);

  // Show a clean loading state while hydrating
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If authenticated, we are redirecting in useEffect, so show nothing
  if (isAuthenticated) {
    return null;
  }

  // If not authenticated, show the login page directly at the root
  return <LoginPage />;
}
