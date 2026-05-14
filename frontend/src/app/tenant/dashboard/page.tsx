'use client';

import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { 
  Home, 
  CreditCard, 
  Calendar, 
  MapPin, 
  Download, 
  Upload, 
  CheckCircle2,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function TenantDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 leading-none">Welcome Home, John!</h2>
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Skyline Apartments • Wing A • Flat 101</span>
            </div>
          </div>
          <Badge className="w-fit bg-emerald-50 text-emerald-600 border-emerald-100 px-6 py-2 text-sm font-bold rounded-2xl shadow-sm">
            Resident Status: Active
          </Badge>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-4 group hover:-translate-y-1 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Monthly Rent
              </CardTitle>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Home className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-slate-900">$1,500.00</div>
              <p className="text-sm text-slate-400 font-bold mt-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" /> Due on 1st of every month
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-4 group hover:-translate-y-1 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Security Deposit
              </CardTitle>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CreditCard className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-slate-900">$5,000.00</div>
              <p className="text-sm text-emerald-600 font-bold mt-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Fully Paid & Verified
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-4 group hover:-translate-y-1 transition-all md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Upcoming Due
              </CardTitle>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Calendar className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-slate-900">June 1, 2026</div>
              <p className="text-sm text-amber-600 font-bold mt-2">In exactly 20 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-black text-slate-900">Recent Activity</CardTitle>
              <CardDescription className="font-medium text-slate-400">Your latest payment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">May 2026 Rent Paid</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">May 01 • 10:45 AM</p>
                  </div>
                </div>
                <p className="font-black text-2xl text-slate-900">$1,500.00</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-slate-200 hover:bg-slate-50 transition-all">
                  <Download className="w-4 h-4 mr-2 text-indigo-600" /> Get Receipt
                </Button>
                <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-slate-200 hover:bg-slate-50 transition-all">
                  <Eye className="w-4 h-4 mr-2 text-indigo-600" /> View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl shadow-indigo-200 bg-indigo-600 text-white rounded-[2.5rem]">
            <CardHeader>
              <CardTitle className="text-2xl font-black">Quick Actions</CardTitle>
              <CardDescription className="text-indigo-100/70 font-medium">Manage your residency essentials</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="secondary" className="h-32 flex-col gap-3 rounded-[2rem] bg-white/10 hover:bg-white/20 border-none text-white transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="font-bold">Pay Rent</span>
              </Button>
              <Button variant="secondary" className="h-32 flex-col gap-3 rounded-[2rem] bg-white/10 hover:bg-white/20 border-none text-white transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <span className="font-bold">Raise Issue</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
