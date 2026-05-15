'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { propertyService } from '@/services/propertyService';
import { mappingService } from '@/services/mappingService';
import { Property, Flat, Tenant } from '@/types';
import { Loader2, Building2, Home, Search, Check, ChevronsUpDown } from 'lucide-react';
import { toast } from 'sonner';

const allocateSchema = z.object({
  propertyId: z.string().min(1, 'Please select a property'),
  wingId: z.string().min(1, 'Please select a wing'),
  floorId: z.string().min(1, 'Please select a floor'),
  flatId: z.string().min(1, 'Please select a flat'),
  agreementStartDate: z.string().min(1, 'Start date is required'),
  agreementEndDate: z.string().min(1, 'End date is required'),
});

type AllocateFormValues = z.infer<typeof allocateSchema>;

interface AllocateFlatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tenant: Tenant | null;
}

export default function AllocateFlatModal({
  isOpen,
  onClose,
  onSuccess,
  tenant,
}: AllocateFlatModalProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [wings, setWings] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);
  const [flats, setFlats] = useState<Flat[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingFlats, setLoadingFlats] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [wingOpen, setWingOpen] = useState(false);
  const [floorOpen, setFloorOpen] = useState(false);
  const [flatOpen, setFlatOpen] = useState(false);
  
  const [propertySearch, setPropertySearch] = useState('');
  const [wingSearch, setWingSearch] = useState('');
  const [floorSearch, setFloorSearch] = useState('');
  const [flatSearch, setFlatSearch] = useState('');

  const form = useForm<AllocateFormValues>({
    resolver: zodResolver(allocateSchema),
    defaultValues: {
      propertyId: '',
      wingId: '',
      floorId: '',
      flatId: '',
      agreementStartDate: new Date().toISOString().split('T')[0],
      agreementEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    },
  });

  const selectedPropertyId = form.watch('propertyId');
  const selectedWingId = form.watch('wingId');
  const selectedFloorId = form.watch('floorId');

  useEffect(() => {
    if (isOpen) {
      fetchProperties();
      form.reset({
        propertyId: '',
        wingId: '',
        floorId: '',
        flatId: '',
        agreementStartDate: new Date().toISOString().split('T')[0],
        agreementEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedPropertyId) {
      fetchWings(selectedPropertyId);
      form.setValue('wingId', '');
      form.setValue('floorId', '');
      form.setValue('flatId', '');
    }
  }, [selectedPropertyId]);

  useEffect(() => {
    if (selectedWingId) {
      fetchFloors(selectedWingId);
      form.setValue('floorId', '');
      form.setValue('flatId', '');
    }
  }, [selectedWingId]);

  useEffect(() => {
    if (selectedFloorId) {
      fetchFlats(selectedFloorId);
      form.setValue('flatId', '');
    }
  }, [selectedFloorId]);

  const fetchProperties = async () => {
    try {
      setLoadingProperties(true);
      const data = await propertyService.getProperties();
      setProperties(data);
    } catch (error) {
      toast.error('Failed to fetch properties');
    } finally {
      setLoadingProperties(false);
    }
  };

  const fetchWings = async (propertyId: string) => {
    try {
      setLoadingWings(true);
      const data = await propertyService.getWings(propertyId);
      setWings(data);
    } catch (error) {
      toast.error('Failed to fetch wings');
    } finally {
      setLoadingWings(false);
    }
  };

  const fetchFloors = async (wingId: string) => {
    try {
      setLoadingFloors(true);
      const data = await propertyService.getFloors(wingId);
      setFloors(data);
    } catch (error) {
      toast.error('Failed to fetch floors');
    } finally {
      setLoadingFloors(false);
    }
  };

  const fetchFlats = async (floorId: string) => {
    try {
      setLoadingFlats(true);
      const data = await propertyService.getFlatsByFloor(floorId);
      setFlats(data.filter(f => f.status === 'AVAILABLE'));
    } catch (error) {
      toast.error('Failed to fetch flats');
    } finally {
      setLoadingFlats(false);
    }
  };

  const filteredProperties = properties.filter(p => 
    p.propertyName.toLowerCase().includes(propertySearch.toLowerCase())
  );

  const filteredWings = wings.filter(w => 
    w.wingName.toLowerCase().includes(wingSearch.toLowerCase())
  );

  const filteredFloors = floors.filter(f => 
    f.floorName.toLowerCase().includes(floorSearch.toLowerCase())
  );

  const filteredFlats = flats.filter(f => 
    f.flatNumber.toLowerCase().includes(flatSearch.toLowerCase())
  );

  const onSubmit = async (values: AllocateFormValues) => {
    if (!tenant) return;
    try {
      setSubmitting(true);
      await mappingService.assignTenant({
        tenantId: tenant.id,
        flatId: parseInt(values.flatId),
        agreementStartDate: values.agreementStartDate,
        agreementEndDate: values.agreementEndDate,
      });
      toast.success('Flat allocated successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to allocate flat');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Allocate Flat to {tenant?.fullName}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Select Property</FormLabel>
                  <Popover open={propertyOpen} onOpenChange={(val) => {
                    setPropertyOpen(val);
                    if (!val) setPropertySearch('');
                  }} modal={false}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={propertyOpen}
                          className={cn(
                            "w-full justify-between font-normal h-11",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? properties.find((p) => String(p.id) === field.value)?.propertyName
                            : "Select property..."}
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
                              placeholder="Search property..." 
                              className="w-full pl-9 pr-3 h-10 bg-transparent border-none text-sm outline-none focus:ring-0"
                              value={propertySearch}
                              onChange={(e) => setPropertySearch(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key !== 'Escape') {
                                  e.stopPropagation();
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto flex-1">
                          {filteredProperties.length > 0 ? (
                            <div className="p-1">
                              {filteredProperties.map((p) => (
                                <button
                                  key={p.id}
                                  type="button"
                                  className={cn(
                                    "flex w-full items-center rounded-sm px-2 py-2.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                                    String(p.id) === field.value && "bg-accent text-accent-foreground"
                                  )}
                                  onClick={() => {
                                    form.setValue("propertyId", String(p.id));
                                    setPropertyOpen(false);
                                    setPropertySearch('');
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", String(p.id) === field.value ? "opacity-100" : "opacity-0")} />
                                  {p.propertyName}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-sm text-slate-500 italic">No properties found</div>
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
                name="wingId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Select Wing</FormLabel>
                    <Popover open={wingOpen} onOpenChange={(val) => {
                      setWingOpen(val);
                      if (!val) setWingSearch('');
                    }} modal={false}>
                      <PopoverTrigger asChild disabled={!selectedPropertyId}>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={wingOpen}
                            disabled={!selectedPropertyId}
                            className={cn(
                              "w-full justify-between font-normal h-11",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? wings.find((w) => String(w.id) === field.value)?.wingName
                              : "Select wing..."}
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
                                placeholder="Search wing..." 
                                className="w-full pl-9 pr-3 h-10 bg-transparent border-none text-sm outline-none focus:ring-0"
                                value={wingSearch}
                                onChange={(e) => setWingSearch(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key !== 'Escape') {
                                    e.stopPropagation();
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="overflow-y-auto flex-1">
                            {filteredWings.length > 0 ? (
                              <div className="p-1">
                                {filteredWings.map((w) => (
                                  <button
                                    key={w.id}
                                    type="button"
                                    className={cn(
                                      "flex w-full items-center rounded-sm px-2 py-2.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                                      String(w.id) === field.value && "bg-accent text-accent-foreground"
                                    )}
                                    onClick={() => {
                                      form.setValue("wingId", String(w.id));
                                      setWingOpen(false);
                                      setWingSearch('');
                                    }}
                                  >
                                    <Check className={cn("mr-2 h-4 w-4", String(w.id) === field.value ? "opacity-100" : "opacity-0")} />
                                    {w.wingName}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 text-center text-sm text-slate-500 italic">No wings found</div>
                            )}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="floorId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Select Floor</FormLabel>
                    <Popover open={floorOpen} onOpenChange={(val) => {
                      setFloorOpen(val);
                      if (!val) setFloorSearch('');
                    }} modal={false}>
                      <PopoverTrigger asChild disabled={!selectedWingId}>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={floorOpen}
                            disabled={!selectedWingId}
                            className={cn(
                              "w-full justify-between font-normal h-11",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? floors.find((f) => String(f.id) === field.value)?.floorName
                              : "Select floor..."}
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
                                placeholder="Search floor..." 
                                className="w-full pl-9 pr-3 h-10 bg-transparent border-none text-sm outline-none focus:ring-0"
                                value={floorSearch}
                                onChange={(e) => setFloorSearch(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key !== 'Escape') {
                                    e.stopPropagation();
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="overflow-y-auto flex-1">
                            {filteredFloors.length > 0 ? (
                              <div className="p-1">
                                {filteredFloors.map((f) => (
                                  <button
                                    key={f.id}
                                    type="button"
                                    className={cn(
                                      "flex w-full items-center rounded-sm px-2 py-2.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                                      String(f.id) === field.value && "bg-accent text-accent-foreground"
                                    )}
                                    onClick={() => {
                                      form.setValue("floorId", String(f.id));
                                      setFloorOpen(false);
                                      setFloorSearch('');
                                    }}
                                  >
                                    <Check className={cn("mr-2 h-4 w-4", String(f.id) === field.value ? "opacity-100" : "opacity-0")} />
                                    {f.floorName}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 text-center text-sm text-slate-500 italic">No floors found</div>
                            )}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="flatId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Select Flat (Available Only)</FormLabel>
                  <Popover open={flatOpen} onOpenChange={(val) => {
                    setFlatOpen(val);
                    if (!val) setFlatSearch('');
                  }} modal={false}>
                    <PopoverTrigger asChild disabled={!selectedFloorId}>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={flatOpen}
                          disabled={!selectedFloorId}
                          className={cn(
                            "w-full justify-between font-normal h-11",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? `Flat ${flats.find((f) => String(f.id) === field.value)?.flatNumber}`
                            : "Select flat..."}
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
                              placeholder="Search flat..." 
                              className="w-full pl-9 pr-3 h-10 bg-transparent border-none text-sm outline-none focus:ring-0"
                              value={flatSearch}
                              onChange={(e) => setFlatSearch(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key !== 'Escape') {
                                  e.stopPropagation();
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto flex-1">
                          {filteredFlats.length > 0 ? (
                            <div className="p-1">
                              {filteredFlats.map((f) => (
                                <button
                                  key={f.id}
                                  type="button"
                                  className={cn(
                                    "flex w-full items-center rounded-sm px-2 py-2.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                                    String(f.id) === field.value && "bg-accent text-accent-foreground"
                                  )}
                                  onClick={() => {
                                    form.setValue("flatId", String(f.id));
                                    setFlatOpen(false);
                                    setFlatSearch('');
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", String(f.id) === field.value ? "opacity-100" : "opacity-0")} />
                                  Flat {f.flatNumber} (₹{f.rentAmount})
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-sm text-slate-500 italic">No available flats found</div>
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
              <Button type="submit" disabled={submitting || !selectedPropertyId || !form.watch('flatId')}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Allocate Flat
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
