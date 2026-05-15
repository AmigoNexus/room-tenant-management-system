'use client';

import React, { useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tenant } from '@/types';
import { Loader2 } from 'lucide-react';

const tenantSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().length(10, 'Phone number must be exactly 10 digits').optional().or(z.literal('')),
  password: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  occupation: z.string().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  // If we are creating a new tenant (no id/tenant context), password should be required
  // However, the modal doesn't know about creation vs update in the schema itself easily
  // unless we pass a flag or check the values. 
  // Let's keep it simple: password is required if it's less than 6 chars AND not empty.
  if (data.password && data.password.length > 0 && data.password.length < 6) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password must be at least 6 characters",
      path: ["password"],
    });
  }
});

type TenantFormValues = z.infer<typeof tenantSchema>;

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TenantFormValues) => Promise<void>;
  tenant?: Tenant | null;
  loading?: boolean;
}

export default function TenantModal({
  isOpen,
  onClose,
  onSubmit,
  tenant,
  loading = false,
}: TenantModalProps) {
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      address: '',
      occupation: '',
    },
  });

  useEffect(() => {
    if (tenant) {
      form.reset({
        fullName: tenant.fullName,
        email: tenant.email,
        phone: tenant.phone,
        password: '',
        address: tenant.address,
        occupation: tenant.occupation,
      });
    } else {
      form.reset({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        occupation: '',
      });
    }
  }, [tenant, form, isOpen]);

  const handleSubmit = async (values: TenantFormValues) => {
    // Basic validation for password on creation
    if (!tenant && (!values.password || values.password.length < 6)) {
      form.setError('password', { message: 'Password is required and must be at least 6 characters for new tenants' });
      return;
    }
    await onSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{tenant ? 'Edit Tenant' : 'Add New Tenant'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Vikram Vedanth" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="vikram@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="9909090909" 
                        {...field} 
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tenant ? 'New Password (Optional)' : <>Password <span className="text-destructive">*</span></>}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, City, Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {tenant ? 'Update Tenant' : 'Add Tenant'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
