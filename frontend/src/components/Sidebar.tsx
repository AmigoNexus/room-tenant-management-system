'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  MapPin, 
  CreditCard, 
  BarChart3, 
  AlertCircle, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

const ownerMenus = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Properties', icon: Building2, href: '/properties' },
  { name: 'Tenants', icon: Users, href: '/tenants' },
  { name: 'Mapping', icon: MapPin, href: '/mapping' },
  { name: 'Payments', icon: CreditCard, href: '/payments' },
  { name: 'Reports', icon: BarChart3, href: '/reports' },
  { name: 'Due Payments', icon: AlertCircle, href: '/dues' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

const tenantMenus = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/tenant/dashboard' },
  { name: 'Payments', icon: CreditCard, href: '/tenant/payments' },
  { name: 'Profile', icon: Settings, href: '/tenant/profile' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  
  const menus = user?.role === 'OWNER' ? ownerMenus : tenantMenus;

  return (
    <div className={cn(
      "hidden md:flex flex-col h-screen bg-white border-r transition-all duration-300 relative shadow-sm",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
          <Home className="text-white w-5 h-5" />
        </div>
        {!isCollapsed && (
          <span className="font-black text-xl tracking-tight text-slate-900">
            RTM <span className="text-indigo-600">Pro</span>
          </span>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1 py-4">
        {menus.map((menu) => (
          <Link 
            key={menu.name} 
            href={menu.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
              pathname === menu.href 
                ? "bg-indigo-50 text-indigo-600 font-bold" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <menu.icon className={cn("w-5 h-5", pathname === menu.href ? "text-indigo-600" : "group-hover:scale-110 transition-transform")} />
            {!isCollapsed && <span className="text-sm">{menu.name}</span>}
            {pathname === menu.href && (
              <motion.div 
                layoutId="active-pill"
                className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full" 
              />
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Button 
          variant="ghost" 
          className={cn("w-full justify-start gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors", isCollapsed && "px-2")}
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-bold text-sm">Logout</span>}
        </Button>
      </div>

      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1.5 shadow-md hover:bg-slate-50 transition-colors z-50 text-slate-400"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
}

import { motion } from 'framer-motion';
