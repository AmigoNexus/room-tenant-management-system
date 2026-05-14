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

const wingSchema = z.object({
  wingName: z.string().min(2, 'Wing name must be at least 2 characters'),
});

type WingFormValues = z.infer<typeof wingSchema>;

interface AddWingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  onSuccess: () => void;
}

export default function AddWingModal({ open, onOpenChange, propertyId, onSuccess }: AddWingModalProps) {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<WingFormValues>({
    resolver: zodResolver(wingSchema),
    defaultValues: { wingName: '' },
  });

  const onSubmit = async (values: WingFormValues) => {
    setLoading(true);
    try {
      await propertyService.addWing({ wingName: values.wingName, propertyId });
      toast({
        title: 'Wing added',
        description: 'The new wing was added successfully.',
      });
      onSuccess();
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to add wing',
        description: error?.message || 'Unable to add the wing right now.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 rounded-4xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900">Add Wing</DialogTitle>
          <DialogDescription className="font-medium text-slate-500">
            Add a new wing to this property.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="wingName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-bold">Wing Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Wing A"
                      className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-indigo-600 focus:bg-white transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" className="rounded-xl font-bold h-12" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="rounded-xl font-black h-12 px-8 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">
                {loading ? 'Adding...' : 'Add Wing'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
