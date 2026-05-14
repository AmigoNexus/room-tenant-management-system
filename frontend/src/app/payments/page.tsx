'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { 
  CreditCard, 
  Search, 
  Download, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

const mockPayments = [
  { id: '1', tenant: 'John Doe', flat: '101', month: 'May 2026', amount: 1500, status: 'PAID', date: '2026-05-01' },
  { id: '2', tenant: 'Jane Smith', flat: '202', month: 'May 2026', amount: 1500, status: 'PENDING', date: '-' },
  { id: '3', tenant: 'Robert Johnson', flat: 'N/A', month: 'May 2026', amount: 0, status: 'OVERDUE', date: '-' },
  { id: '4', tenant: 'Alice Williams', flat: '305', month: 'May 2026', amount: 2000, status: 'PAID', date: '2026-05-03' },
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredPayments = mockPayments.filter(p => 
    activeTab === 'all' || p.status.toLowerCase() === activeTab.toLowerCase()
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gradient">Payments</h2>
            <p className="text-muted-foreground">Track rent and deposit payments</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button>
              <CreditCard className="w-4 h-4 mr-2" /> Mark as Paid
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
            
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search records..." className="pl-10" />
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Flat</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{payment.tenant}</TableCell>
                    <TableCell>{payment.flat}</TableCell>
                    <TableCell>{payment.month}</TableCell>
                    <TableCell className="font-bold">${payment.amount}</TableCell>
                    <TableCell>
                      {payment.status === 'PAID' && (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none hover:bg-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Paid
                        </Badge>
                      )}
                      {payment.status === 'PENDING' && (
                        <Badge className="bg-amber-500/10 text-amber-500 border-none hover:bg-amber-500/20">
                          <Clock className="w-3 h-3 mr-1" /> Pending
                        </Badge>
                      )}
                      {payment.status === 'OVERDUE' && (
                        <Badge className="bg-rose-500/10 text-rose-500 border-none hover:bg-rose-500/20">
                          <AlertCircle className="w-3 h-3 mr-1" /> Overdue
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{payment.date}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" title="View details">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Download receipt">
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Tabs>

        {/* Mobile Summary Cards (Optional alternative for small screens) */}
        <div className="md:hidden space-y-4">
          {filteredPayments.map((payment, i) => (
            <motion.div 
              key={payment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border flex items-center justify-between"
            >
              <div>
                <p className="font-bold">{payment.tenant}</p>
                <p className="text-xs text-muted-foreground">Flat {payment.flat} • {payment.month}</p>
                <p className="text-lg font-bold mt-1">${payment.amount}</p>
              </div>
              <div className="text-right space-y-2">
                <Badge variant="outline" className="text-[10px]">
                  {payment.status}
                </Badge>
                <div className="flex gap-1 justify-end">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
