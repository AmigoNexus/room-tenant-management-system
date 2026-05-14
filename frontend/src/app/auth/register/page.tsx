'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, User, ArrowRight, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: 'Name must be at least 2 characters',
  }),

  email: z.string().email({
    message: 'Invalid email address',
  }),

  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),

  // OPTIONAL PHONE
  phone: z.string().optional(),

  role: z.enum(['OWNER', 'TENANT']),
});

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phone: '',
      role: 'OWNER',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);

      // remove empty phone
      const payload = {
        ...values,
        phone: values.phone?.trim() || null,
      };

      const response = await fetch(
        'http://localhost:8080/api/v1/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
      toast.success("Account created successfully");

        form.reset();

        // wait so toast is visible
        setTimeout(() => {
          router.push('/auth/login');
        }, 1500);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);

      toast.error("Server Error: Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white p-8 rounded-3xl shadow-xl space-y-6 border border-slate-200">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Create an account
            </h1>

            <p className="text-slate-500">
              Join RTM Pro and manage your space with ease
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* ROLE */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-slate-700 font-medium">
                      I am a...
                    </FormLabel>

                    <FormControl>
                      <Tabs
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-2 bg-slate-100 border border-slate-200">
                          <TabsTrigger
                            value="OWNER"
                            className="data-[state=active]:bg-primary data-[state=active]:text-white"
                          >
                            Property Owner
                          </TabsTrigger>

                          <TabsTrigger
                            value="TENANT"
                            className="data-[state=active]:bg-primary data-[state=active]:text-white"
                          >
                            Tenant
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* FULL NAME */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">
                      Full Name
                    </FormLabel>

                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                        <Input
                          placeholder="Vaibhav Zalte"
                          {...field}
                          className="pl-10 bg-white border-slate-200 text-slate-900 focus-visible:ring-primary"
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">
                      Email
                    </FormLabel>

                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                        <Input
                          placeholder="name@example.com"
                          {...field}
                          className="pl-10 bg-white border-slate-200 text-slate-900 focus-visible:ring-primary"
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PHONE OPTIONAL */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">
                      Phone Number (Optional)
                    </FormLabel>

                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                        <Input
                          placeholder="9876543210"
                          {...field}
                          className="pl-10 bg-white border-slate-200 text-slate-900 focus-visible:ring-primary"
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">
                      Password
                    </FormLabel>

                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="pl-10 bg-white border-slate-200 text-slate-900 focus-visible:ring-primary"
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-lg font-semibold group mt-4"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}

                {!loading && (
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-primary hover:underline font-semibold"
            >
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}