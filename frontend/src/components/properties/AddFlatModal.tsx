'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { propertyService } from '@/services/propertyService';
import { useToast } from '@/hooks/use-toast';
import { Floor } from '@/types';

const flatSchema = z.object({
  flatNumber: z.string().min(1, 'Flat number is required'),
  rentAmount: z.number().min(0, 'Rent must be positive'),
  depositAmount: z.number().min(0, 'Deposit must be positive'),
  maintenanceAmount: z.number().min(0, 'Maintenance must be positive'),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']),
  floorId: z.string().min(1, 'Select a floor'),
});

type FlatFormValues = z.infer<typeof flatSchema>;

interface AddFlatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  floors: Floor[];
  onSuccess: () => void;
}

export default function AddFlatModal({ open, onOpenChange, floors, onSuccess }: AddFlatModalProps) {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FlatFormValues>({
    resolver: zodResolver(flatSchema),
    defaultValues: {
      flatNumber: '',
      rentAmount: 0,
      depositAmount: 0,
      maintenanceAmount: 0,
      status: 'AVAILABLE',
      floorId: floors.length > 0 ? String(floors[0].id) : '',
    },
  });

  React.useEffect(() => {
    if (floors.length > 0) {
      form.setValue('floorId', String(floors[0].id));
    }
  }, [floors, form]);

  const onSubmit = async (values: FlatFormValues) => {
    setLoading(true);
    try {
      await propertyService.addFlat({
        flatNumber: values.flatNumber,
        rentAmount: values.rentAmount,
        depositAmount: values.depositAmount,
        maintenanceAmount: values.maintenanceAmount,
        status: values.status,
        floorId: values.floorId,
      });
      toast({
        title: 'Flat added',
        description: 'The new flat was added successfully.',
      });
      onSuccess();
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to add flat',
        description: error?.message || 'Unable to add the flat right now.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130 rounded-4xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900">Add Flat</DialogTitle>
          <DialogDescription className="font-medium text-slate-500">
            Add a flat to an existing floor.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="flatNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-bold">Flat Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 101"
                      className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-indigo-600 focus:bg-white transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="rentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-bold">Rent Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="1500"
                        className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-indigo-600 focus:bg-white transition-all"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="depositAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-bold">Deposit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="1500"
                        className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-indigo-600 focus:bg-white transition-all"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="maintenanceAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-bold">Maintenance</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="100"
                      className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-indigo-600 focus:bg-white transition-all"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-bold">Status</FormLabel>
                    <FormControl>
                      <select
                        className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        {...field}
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="OCCUPIED">OCCUPIED</option>
                        <option value="MAINTENANCE">MAINTENANCE</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="floorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-bold">Select Floor</FormLabel>
                    <FormControl>
                      <select
                        className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        value={field.value}
                        onChange={(event) => field.onChange(event.target.value)}
                      >
                        {floors.map((floor) => (
                          <option key={floor.id} value={String(floor.id)}>
                            {floor.floorName}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" className="rounded-xl font-bold h-12" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || floors.length === 0} className="rounded-xl font-black h-12 px-8 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">
                {loading ? 'Adding...' : 'Add Flat'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
