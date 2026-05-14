'use client';

import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Jan', income: 4000, dues: 2400 },
  { name: 'Feb', income: 3000, dues: 1398 },
  { name: 'Mar', income: 2000, dues: 9800 },
  { name: 'Apr', income: 2780, dues: 3908 },
  { name: 'May', income: 1890, dues: 4800 },
  { name: 'Jun', income: 2390, dues: 3800 },
];

const stats = [
  { title: 'Total Properties', value: '12', icon: Building2, trend: '+2', trendUp: true, color: 'indigo' },
  { title: 'Active Tenants', value: '148', icon: Users, trend: '+12', trendUp: true, color: 'blue' },
  { title: 'Monthly Income', value: '$24,500', icon: CreditCard, trend: '+8.2%', trendUp: true, color: 'emerald' },
  { title: 'Pending Dues', value: '$3,200', icon: TrendingUp, trend: '-4%', trendUp: false, color: 'rose' },
];

export default function OwnerDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 leading-none">Global Insights</h2>
            <p className="text-slate-500 font-medium">Strategic overview of your property empire</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            <button className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl">Real-time</button>
            <button className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Historical</button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] group hover:-translate-y-2 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className={`p-2.5 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white transition-all duration-300`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-50 border border-slate-100">
                    {stat.trendUp ? (
                      <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-rose-500" />
                    )}
                    <span className={`text-[10px] font-black ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {stat.trend}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                    {stat.title}
                  </CardTitle>
                  <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4 border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">Revenue Stream</CardTitle>
                <CardDescription className="font-medium text-slate-400">Monthly breakdown of income and dues</CardDescription>
              </div>
              <Activity className="text-indigo-600 w-6 h-6" />
            </CardHeader>
            <CardContent className="h-[350px] pt-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                    tickFormatter={(value) => `$${value}`} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ border: 'none', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  />
                  <Bar dataKey="income" fill="#4f46e5" radius={[6, 6, 6, 6]} barSize={20} />
                  <Bar dataKey="dues" fill="#f43f5e" radius={[6, 6, 6, 6]} barSize={20} opacity={0.3} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">Growth Index</CardTitle>
                <CardDescription className="font-medium text-slate-400">Portfolio performance tracking</CardDescription>
              </div>
              <Target className="text-blue-600 w-6 h-6" />
            </CardHeader>
            <CardContent className="h-[350px] pt-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                  />
                  <Tooltip 
                    contentStyle={{ border: 'none', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
