'use client';

import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { 
  AlertTriangle, 
  CheckCircle2,
  MessageSquare, 
  Phone, 
  Send,
  MoreVertical,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

const overdueTenants = [
  { id: '1', name: 'Robert Johnson', flat: '302', amount: 1500, days: 12, phone: '+1 555 000 111' },
  { id: '2', name: 'Sarah Miller', flat: '105', amount: 1200, days: 5, phone: '+1 555 222 333' },
  { id: '3', name: 'Michael Brown', flat: '401', amount: 2000, days: 2, phone: '+1 555 444 555' },
];

export default function DuesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gradient">Due Payments</h2>
            <p className="text-muted-foreground">Monitor and follow up on overdue rent</p>
          </div>
          <div className="flex items-center gap-2 bg-rose-500/10 text-rose-500 px-4 py-2 rounded-full border border-rose-500/20">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-bold">Total Overdue: $4,700</span>
          </div>
        </div>

        <div className="grid gap-4">
          {overdueTenants.map((tenant, i) => (
            <motion.div
              key={tenant.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm overflow-hidden hover:ring-1 hover:ring-rose-500/30 transition-all">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="p-6 flex items-center gap-4 flex-1">
                      <Avatar className="h-12 w-12 border-2 border-rose-500/20">
                        <AvatarFallback className="bg-rose-500/10 text-rose-500 font-bold">
                          {tenant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-lg">{tenant.name}</h4>
                          <Badge variant="destructive" className="bg-rose-500 text-white border-none text-[10px]">
                            {tenant.days} Days Overdue
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Flat {tenant.flat} • Skyline Apartments</p>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 px-6 py-4 md:py-6 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 md:border-l">
                      <p className="text-2xl font-black text-rose-500">${tenant.amount}</p>
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline" className="rounded-full hover:bg-emerald-500 hover:text-white transition-colors">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="rounded-full hover:bg-indigo-500 hover:text-white transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button className="rounded-full shadow-lg shadow-primary/20">
                          <Send className="w-4 h-4 mr-2" /> Send Reminder
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {overdueTenants.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold">All caught up!</h3>
              <p className="text-muted-foreground">No pending or overdue payments found for this month.</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
