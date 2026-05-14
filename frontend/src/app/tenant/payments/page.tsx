'use client';

import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { 
  CreditCard, 
  Download, 
  Upload, 
  Search, 
  History,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const tenantPayments = [
  { id: '1', month: 'May 2026', amount: 1500, status: 'PAID', date: 'May 01, 2026' },
  { id: '2', month: 'April 2026', amount: 1500, status: 'PAID', date: 'April 02, 2026' },
  { id: '3', month: 'March 2026', amount: 1500, status: 'PAID', date: 'March 01, 2026' },
];

export default function TenantPaymentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gradient">Payment History</h2>
            <p className="text-muted-foreground">Manage your rent payments and receipts</p>
          </div>
          <Button className="shadow-lg shadow-primary/20">
            <Upload className="w-4 h-4 mr-2" /> Upload Screenshot
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2 border-none shadow-md bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>History</CardTitle>
                <CardDescription>All your past transactions</CardDescription>
              </div>
              <div className="relative w-48">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-8 h-8 bg-muted/50 border-none" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {tenantPayments.map((p, i) => (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold">{p.month} Rent</p>
                        <p className="text-xs text-muted-foreground">Paid on {p.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="font-bold text-lg">${p.amount}</p>
                      <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Current Dues</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-6 space-y-4">
                <p className="text-4xl font-black">$0.00</p>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-none px-4 py-1">
                  Everything Paid
                </Badge>
                <p className="text-xs text-muted-foreground">Next rent due in 20 days</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
                <CardDescription className="text-white/70">Contact property management for any payment issues.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full">Raise a Ticket</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
