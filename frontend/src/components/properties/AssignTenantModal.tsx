'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { tenantService } from '@/services/tenantService';
import { mappingService } from '@/services/mappingService';
import { Tenant } from '@/types';
import { Loader2, Calendar, Search, Check, ChevronsUpDown } from 'lucide-react';
import { toast } from 'sonner';

const mappingSchema = z.object({
  tenantId: z.string().min(1, 'Please select a tenant'),
  agreementStartDate: z.string().min(1, 'Start date is required'),
  agreementEndDate: z.string().min(1, 'End date is required'),
});

type MappingFormValues = z.infer<typeof mappingSchema>;

interface AssignTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  flatId: number | null;
  flatNumber: string;
}

export default function AssignTenantModal({
  isOpen,
  onClose,
  onSuccess,
  flatId,
  flatNumber,
}: AssignTenantModalProps) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const form = useForm<MappingFormValues>({
    resolver: zodResolver(mappingSchema),
    defaultValues: {
      tenantId: '',
      agreementStartDate: new Date().toISOString().split('T')[0],
      agreementEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchTenants();
      form.reset({
        tenantId: '',
        agreementStartDate: new Date().toISOString().split('T')[0],
        agreementEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      });
    }
  }, [isOpen]);

  const fetchTenants = async () => {
    try {
      setLoadingTenants(true);
      const data = await tenantService.getTenants();
      setTenants(data.filter(t => t.active));
    } catch (error) {
      toast.error('Failed to fetch tenants');
    } finally {
      setLoadingTenants(false);
    }
  };

  const filteredTenants = tenants.filter(tenant => 
    tenant.fullName.toLowerCase().includes(search.toLowerCase()) ||
    tenant.email.toLowerCase().includes(search.toLowerCase())
  );

  const onSubmit = async (values: MappingFormValues) => {
    if (!flatId) return;
    try {
      setSubmitting(true);
      await mappingService.assignTenant({
        tenantId: parseInt(values.tenantId),
        flatId: flatId,
        agreementStartDate: values.agreementStartDate,
        agreementEndDate: values.agreementEndDate,
      });
      toast.success('Tenant assigned successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign tenant');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Tenant to Flat {flatNumber}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="tenantId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Select Tenant</FormLabel>
                  <Popover open={open} onOpenChange={(val) => {
                    setOpen(val);
                    if (!val) setSearch('');
                  }} modal={false}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            "w-full justify-between font-normal h-11",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? tenants.find((t) => String(t.id) === field.value)?.fullName
                            : "Select a tenant..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-[var(--radix-popover-trigger-width)] p-0 z-[100]" 
                      align="start"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <div className="flex flex-col h-full max-h-[350px]">
                        <div className="p-2 border-b sticky top-0 bg-popover z-10">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              autoFocus
                              placeholder="Search tenant..." 
                              className="w-full pl-9 pr-3 h-10 bg-transparent border-none text-sm outline-none focus:ring-0"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key !== 'Escape') {
                                  e.stopPropagation();
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto flex-1">
                          {filteredTenants.length > 0 ? (
                            <div className="p-1">
                              {filteredTenants.map((tenant) => (
                                <button
                                  key={tenant.id}
                                  type="button"
                                  className={cn(
                                    "flex w-full items-center rounded-sm px-2 py-2.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-left",
                                    String(tenant.id) === field.value && "bg-accent text-accent-foreground"
                                  )}
                                  onClick={() => {
                                    form.setValue("tenantId", String(tenant.id));
                                    setOpen(false);
                                    setSearch('');
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", String(tenant.id) === field.value ? "opacity-100" : "opacity-0")} />
                                  <div className="flex flex-col">
                                    <span className="font-medium">{tenant.fullName}</span>
                                    <span className="text-xs text-muted-foreground">{tenant.email}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-sm text-slate-500 italic">
                              No tenants found for "{search}"
                            </div>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="agreementStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="agreementEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || loadingTenants}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Assign Tenant
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
