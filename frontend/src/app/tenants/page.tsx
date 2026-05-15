'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  Phone, 
  Mail, 
  Calendar, 
  Filter,
  Trash2,
  Edit,
  User as UserIcon,
  Loader2,
  DoorOpen,
  Home
} from 'lucide-react';
import { mappingService } from '@/services/mappingService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AllocateFlatModal from '@/components/tenants/AllocateFlatModal';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { tenantService } from '@/services/tenantService';
import { Tenant } from '@/types';
import TenantModal from '@/components/tenants/TenantModal';
import DeleteConfirmModal from '@/components/properties/DeleteConfirmModal';
import { toast } from 'sonner';

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [allocateModalOpen, setAllocateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const data = await tenantService.getTenants();
      setTenants(data);
    } catch (error) {
      toast.error('Failed to fetch tenants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleCreateOrUpdate = async (values: any) => {
    try {
      setActionLoading(true);
      if (selectedTenant) {
        await tenantService.updateTenant(selectedTenant.id, values);
        toast.success('Tenant updated successfully');
      } else {
        await tenantService.createTenant(values);
        toast.success('Tenant created successfully');
      }
      setModalOpen(false);
      fetchTenants();
    } catch (error: any) {
      const message = error.message || (selectedTenant ? 'Failed to update tenant' : 'Failed to create tenant');
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTenant) return;
    try {
      setActionLoading(true);
      await tenantService.deleteTenant(selectedTenant.id);
      toast.success('Tenant deleted successfully');
      setDeleteModalOpen(false);
      fetchTenants();
    } catch (error: any) {
      const message = error.message || 'Failed to delete tenant';
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gradient">Tenants</h2>
            <p className="text-muted-foreground">Manage your residents and their details</p>
          </div>
          <Button 
            className="shadow-lg shadow-primary/20"
            onClick={() => {
              setSelectedTenant(null);
              setModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Tenant
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search tenants..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="hidden sm:flex">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block bg-card/50 backdrop-blur-sm rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Tenant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Flat</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="mt-2 text-muted-foreground">Loading tenants...</p>
                  </TableCell>
                </TableRow>
              ) : filteredTenants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                    No tenants found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarImage src={tenant.profileImage} />
                          <AvatarFallback>{tenant.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span>{tenant.fullName}</span>
                          <span className="text-xs text-muted-foreground font-normal">{tenant.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-muted-foreground" /> {tenant.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {tenant.occupation}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {tenant.assignedFlatNumber ? (
                        <Badge className="bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 border-none">
                          Flat {tenant.assignedFlatNumber}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">Not Assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3 text-muted-foreground" /> {tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tenant.active ? 'default' : 'secondary'} className={tenant.active ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none' : ''}>
                        {tenant.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedTenant(tenant);
                            setModalOpen(true);
                          }}>
                            <Edit className="w-4 h-4 mr-2" /> Edit Details
                          </DropdownMenuItem>
                          {!tenant.assignedMappingId ? (
                            <DropdownMenuItem onClick={() => {
                              setSelectedTenant(tenant);
                              setAllocateModalOpen(true);
                            }} className="text-emerald-600">
                              <Home className="w-4 h-4 mr-2" /> Allocate Flat
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-amber-600" onClick={async () => {
                              try {
                                setActionLoading(true);
                                await mappingService.removeMapping(tenant.assignedMappingId!);
                                toast.success('Tenant de-allocated successfully');
                                fetchTenants();
                              } catch (error: any) {
                                toast.error(error.message || 'Failed to de-allocate tenant');
                              } finally {
                                setActionLoading(false);
                              }
                            }}>
                              <DoorOpen className="w-4 h-4 mr-2" /> De-allocate Flat
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive" onClick={() => {
                            setSelectedTenant(tenant);
                            setDeleteModalOpen(true);
                          }}>
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Tenant
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden grid gap-4">
          {loading ? (
             <div className="py-12 flex flex-col items-center">
               <Loader2 className="w-8 h-8 animate-spin text-primary" />
               <p className="mt-2 text-muted-foreground text-sm">Loading tenants...</p>
             </div>
          ) : filteredTenants.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No tenants found
            </div>
          ) : (
            filteredTenants.map((tenant) => (
              <motion.div
                key={tenant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={tenant.profileImage} />
                      <AvatarFallback>{tenant.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold">{tenant.fullName}</p>
                      <Badge variant="secondary" className="text-[10px] py-0 h-4 mt-1">
                        {tenant.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedTenant(tenant);
                        setModalOpen(true);
                      }}>
                        <Edit className="w-4 h-4 mr-2" /> Edit Details
                      </DropdownMenuItem>
                      {!tenant.assignedMappingId ? (
                        <DropdownMenuItem onClick={() => {
                          setSelectedTenant(tenant);
                          setAllocateModalOpen(true);
                        }} className="text-emerald-600">
                          <Home className="w-4 h-4 mr-2" /> Allocate Flat
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-amber-600" onClick={async () => {
                          try {
                            setActionLoading(true);
                            await mappingService.removeMapping(tenant.assignedMappingId!);
                            toast.success('Tenant de-allocated successfully');
                            fetchTenants();
                          } catch (error: any) {
                            toast.error(error.message || 'Failed to de-allocate tenant');
                          } finally {
                            setActionLoading(false);
                          }
                        }}>
                          <DoorOpen className="w-4 h-4 mr-2" /> De-allocate Flat
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-destructive" onClick={() => {
                        setSelectedTenant(tenant);
                        setDeleteModalOpen(true);
                      }}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Occupation</p>
                    <p className="font-medium">{tenant.occupation}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Joined</p>
                    <p className="font-medium">{tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Flat Allocation</p>
                    {tenant.assignedFlatNumber ? (
                      <p className="font-bold text-indigo-600">Flat {tenant.assignedFlatNumber}</p>
                    ) : (
                      <p className="text-slate-400 italic">Not Assigned</p>
                    )}
                  </div>
                  <div className="col-span-2 space-y-2 pt-2 border-t mt-2">
                    <div className="flex items-center gap-2 text-muted-foreground text-[13px]">
                      <Phone className="w-3.5 h-3.5" /> <span>{tenant.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-[13px]">
                      <Mail className="w-3.5 h-3.5" /> <span>{tenant.email}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <TenantModal 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateOrUpdate}
          tenant={selectedTenant}
          loading={actionLoading}
        />

        <AllocateFlatModal 
          isOpen={allocateModalOpen}
          onClose={() => setAllocateModalOpen(false)}
          onSuccess={fetchTenants}
          tenant={selectedTenant}
        />

        <DeleteConfirmModal 
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          onConfirm={handleDelete}
          title="Delete Tenant"
          description={`Are you sure you want to delete ${selectedTenant?.fullName}? This action will also delete the associated user account and cannot be undone.`}
          loading={actionLoading}
        />
      </div>
    </DashboardLayout>
  );
}
