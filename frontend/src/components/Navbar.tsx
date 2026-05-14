'use client';

import React from 'react';
import { Bell, Search, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/useAuthStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-20 border-b bg-white/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-8">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden text-slate-500">
          <Menu className="w-6 h-6" />
        </Button>
        {/* <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search properties, tenants..." 
            className="pl-11 h-11 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 rounded-xl" 
          />
        </div> */}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white" />
        </Button>

        <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-3 px-2 h-11 rounded-xl hover:bg-slate-50 transition-all">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name || 'Guest'}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user?.role || 'User'}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
                <User className="w-5 h-5" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-slate-100 shadow-2xl shadow-indigo-100">
            <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-50" />
            <DropdownMenuItem className="rounded-xl px-3 py-2 focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer font-medium">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl px-3 py-2 focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer font-medium">Billing & Subscription</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-50" />
            <DropdownMenuItem className="rounded-xl px-3 py-2 focus:bg-red-50 focus:text-red-600 cursor-pointer font-bold" onClick={logout}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
