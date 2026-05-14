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
import { Wing, Floor } from '@/types';

const floorSchema = z.object({
  floorName: z.string().min(1, 'Floor name is required'),
  wingId: z.string().min(1, 'Select a wing'),
});

type FloorFormValues = z.infer<typeof floorSchema>;

interface AddFloorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  wings: Wing[];
  onSuccess: () => void;
  defaultWingId?: string | number;
  editFloor?: Floor | null;
}

export default function AddFloorModal({ open, onOpenChange, propertyId, wings, onSuccess, defaultWingId, editFloor }: AddFloorModalProps) {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FloorFormValues>({
    resolver: zodResolver(floorSchema),
    defaultValues: {
      floorName: editFloor?.floorName || '',
      wingId: editFloor ? String(editFloor.wingId) : (defaultWingId ? String(defaultWingId) : (wings.length > 0 ? String(wings[0].id) : '')),
    },
  });

  React.useEffect(() => {
    if (open) {
      if (editFloor) {
        form.reset({
          floorName: editFloor.floorName,
          wingId: String(editFloor.wingId),
        });
      } else {
        form.reset({
          floorName: '',
          wingId: defaultWingId ? String(defaultWingId) : (wings.length > 0 ? String(wings[0].id) : ''),
        });
      }
    }
  }, [open, editFloor, defaultWingId, wings, form]);

  React.useEffect(() => {
    if (open) {
      if (defaultWingId) {
        form.setValue('wingId', String(defaultWingId));
      } else if (wings.length > 0 && !form.getValues('wingId')) {
        form.setValue('wingId', String(wings[0].id));
      }
    }
  }, [open, defaultWingId, wings, form]);

  const onSubmit = async (values: FloorFormValues) => {
    setLoading(true);
    try {
      if (editFloor) {
        await propertyService.updateFloor(editFloor.id, {
          floorName: values.floorName,
          propertyId,
          wingId: values.wingId,
        });
        toast({ title: 'Floor updated', description: 'The floor has been updated successfully.' });
      } else {
        await propertyService.addFloor({
          floorName: values.floorName,
          propertyId,
          wingId: values.wingId,
        });
        toast({ title: 'Floor added', description: 'The new floor was added successfully.' });
      }
      onSuccess();
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to add floor',
        description: error?.message || 'Unable to add the floor right now.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130 rounded-4xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900">
            {editFloor ? 'Edit Floor' : 'Add Floor'}
          </DialogTitle>
          <DialogDescription className="font-medium text-slate-500">
            {editFloor ? 'Update the details of this floor.' : 'Add a new floor to one of the property wings.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="floorName"
              render={({ field }) => (
                <FormItem className='flex flex-col gap-1'>
                  <FormLabel className="text-slate-700 font-bold">Floor Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Floor 1"
                      className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-indigo-600 focus:bg-white transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!defaultWingId && (
              <FormField
                control={form.control}
                name="wingId"
                render={({ field }) => (
                  <FormItem className='flex flex-col gap-1'>
                    <FormLabel className="text-slate-700 font-bold">Select Wing</FormLabel>
                    <FormControl>
                      <select
                        className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        value={field.value}
                        onChange={(event) => field.onChange(event.target.value)}
                      >
                        {wings.map((wing) => (
                          <option key={wing.id} value={String(wing.id)}>
                            {wing.wingName}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" className="rounded-xl font-bold h-12" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || wings.length === 0} className="rounded-xl font-black h-12 px-8 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">
                {loading ? (editFloor ? 'Updating...' : 'Adding...') : (editFloor ? 'Update Floor' : 'Add Floor')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
