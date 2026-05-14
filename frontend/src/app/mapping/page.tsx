'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { 
  MapPin, 
  Plus, 
  Search, 
  Link as LinkIcon, 
  Unlink, 
  Calendar,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const mockMappings = [
  { id: '1', tenant: 'John Doe', property: 'Skyline Apartments', flat: '101 (Wing A)', startDate: '2026-01-15', rent: 1500 },
  { id: '2', tenant: 'Jane Smith', property: 'Skyline Apartments', flat: '202 (Wing B)', startDate: '2026-02-10', rent: 1500 },
];

export default function MappingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gradient">Tenant Mapping</h2>
            <p className="text-muted-foreground">Assign tenants to available flats and rooms</p>
          </div>
          <Button className="shadow-lg shadow-primary/20">
            <LinkIcon className="w-4 h-4 mr-2" /> New Mapping
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockMappings.map((mapping, i) => (
            <motion.div
              key={mapping.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Building className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">{mapping.flat}</span>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tenant</p>
                      <p className="font-bold text-lg">{mapping.tenant}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-2 border-y border-dashed">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Start Date</p>
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <Calendar className="w-3 h-3" /> {mapping.startDate}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Monthly Rent</p>
                      <p className="text-sm font-bold text-primary">${mapping.rent}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1">Edit</Button>
                    <Button variant="ghost" size="sm" className="flex-1 text-destructive hover:bg-destructive/10">
                      <Unlink className="w-4 h-4 mr-2" /> Unmap
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Empty State / Add New Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
            </div>
            <div>
              <p className="font-bold">Map New Tenant</p>
              <p className="text-sm text-muted-foreground">Select a tenant and an empty flat</p>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
