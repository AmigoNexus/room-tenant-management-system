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

const propertySchema = z.object({
  propertyName: z.string().min(3, 'Property name must be at least 3 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

interface CreatePropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreatePropertyModal({ open, onOpenChange, onSuccess }: CreatePropertyModalProps) {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      propertyName: '',
      address: '',
    },
  });

  const onSubmit = async (values: PropertyFormValues) => {
    setLoading(true);
    try {
      await propertyService.addProperty({
        propertyName: values.propertyName,
        address: values.address,
      });
      toast({
        title: 'Success',
        description: 'Property created successfully',
      });
      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create property',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 rounded-4xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900">Add New Property</DialogTitle>
          <DialogDescription className="font-medium text-slate-500">
            Enter the details of your new property below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="propertyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-bold">Property Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Skyline Apartments" 
                      className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-indigo-600 focus:bg-white transition-all" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-bold">Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. 123 Main St, New York" 
                      className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-indigo-600 focus:bg-white transition-all" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                className="rounded-xl font-bold h-12"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="rounded-xl font-black h-12 px-8 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
              >
                {loading ? 'Creating...' : 'Create Property'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
