'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { 
  Home, 
  CreditCard, 
  Settings, 
  LayoutDashboard 
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, hasHydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Basic route protection - only redirect after store has hydrated
    if (hasHydrated && !isAuthenticated && !pathname.startsWith('/auth')) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, hasHydrated, pathname, router]);

  if (!hasHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated && !pathname.startsWith('/auth')) {
    return null;
  }

  // Tenant bottom nav for mobile
  const tenantBottomNav = [
    { name: 'Home', icon: Home, href: '/tenant/dashboard' },
    { name: 'Payments', icon: CreditCard, href: '/tenant/payments' },
    { name: 'Profile', icon: Settings, href: '/tenant/profile' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation for Tenants */}
        {user?.role === 'TENANT' && (
          <nav className="md:hidden h-16 border-t bg-background/80 backdrop-blur-lg flex items-center justify-around px-4 sticky bottom-0">
            {tenantBottomNav.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 transition-colors",
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
