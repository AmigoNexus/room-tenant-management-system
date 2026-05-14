'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  DoorOpen,
  Users,
  Settings2,
  Edit2,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

import { propertyService } from '@/services/propertyService';
import CreatePropertyModal from '@/components/properties/CreatePropertyModal';
import DeleteConfirmModal from '@/components/properties/DeleteConfirmModal';
import { useToast } from '@/hooks/use-toast';

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [deleteConfig, setDeleteConfig] = useState<{
    open: boolean;
    id: string | number | null;
    loading: boolean;
  }>({
    open: false,
    id: null,
    loading: false,
  });
  const { toast } = useToast();

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await propertyService.getProperties();
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch properties', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfig.id) return;
    setDeleteConfig(prev => ({ ...prev, loading: true }));
    try {
      await propertyService.deleteProperty(deleteConfig.id);
      toast({ title: 'Success', description: 'Property deleted successfully' });
      setDeleteConfig({ open: false, id: null, loading: false });
      fetchProperties();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to delete property' });
    } finally {
      setDeleteConfig(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(p =>
    p.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 leading-none">Properties</h2>
            <p className="text-slate-500 font-medium">Manage your premium real estate portfolio</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-bold transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" /> Add New Property
          </Button>
        </div>

        <div className="flex items-center gap-4 max-w-md bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or location..."
              className="pl-10 h-10 bg-transparent border-none focus-visible:ring-0 text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <CreatePropertyModal
          open={isModalOpen || !!editingProperty}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingProperty(null);
          }}
          onSuccess={fetchProperties}
          editProperty={editingProperty}
        />

        <DeleteConfirmModal
          open={deleteConfig.open}
          onOpenChange={(open) => setDeleteConfig(prev => ({ ...prev, open }))}
          title="Delete Property"
          description="Are you sure you want to delete this property? All associated wings, floors, and flats will be permanently removed. This action cannot be undone."
          onConfirm={handleDelete}
          loading={deleteConfig.loading}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-50/50 border-t-indigo-600"></div>
            <p className="text-slate-400 font-bold animate-pulse">Loading properties...</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.length > 0 ? filteredProperties.map((property, i) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50 bg-white group card-hover rounded-4xl">
                  <div className="h-40 bg-slate-50 flex items-center justify-center relative overflow-hidden">
                    <Building2 className="w-16 h-16 text-indigo-600/20 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{property.propertyName}</CardTitle>
                        <CardDescription className="flex items-center gap-1.5 font-medium text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600" /> {property.address}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <div className="grid grid-cols-3 gap-6 p-5 rounded-2xl bg-slate-50/50">
                      <div className="space-y-1.5">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Wings</p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <DoorOpen className="w-4 h-4" />
                          </div>
                          <span className="font-black text-slate-900">{property.wingsCount ?? 0}</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Floors</p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                            <Users className="w-4 h-4" />
                          </div>
                          <span className="font-black text-slate-900">{property.floorsCount ?? 0}</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Flats</p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <span className="font-black text-slate-900">{property.flatsCount ?? 0}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 grid grid-cols-3 gap-2 border-t border-slate-50 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl font-bold text-indigo-600 hover:bg-indigo-50 gap-2 h-10 px-0"
                      asChild
                    >
                      <Link href={`/properties/${property.id}`}>
                        <Settings2 className="w-4 h-4" /> Manage
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl font-bold text-slate-500 hover:bg-slate-50 gap-2 h-10 px-0"
                      onClick={() => setEditingProperty(property)}
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl font-bold text-rose-500 hover:bg-rose-50 gap-2 h-10 px-0"
                      onClick={() => setDeleteConfig({ open: true, id: property.id, loading: false })}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No properties found</h3>
                <p className="text-slate-400 font-medium">Start by adding your first property to the system.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
