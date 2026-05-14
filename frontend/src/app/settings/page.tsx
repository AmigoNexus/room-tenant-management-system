'use client';

import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Moon, 
  Globe, 
  Mail,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const sections = [
    { 
      title: 'Profile Settings', 
      description: 'Manage your public profile and personal info',
      icon: User,
      items: ['Edit Name', 'Update Avatar', 'Change Email']
    },
    { 
      title: 'Security', 
      description: 'Password, 2FA and login sessions',
      icon: Shield,
      items: ['Change Password', 'Two-Factor Auth', 'Recent Devices']
    },
    { 
      title: 'Notifications', 
      description: 'Configure how you receive alerts',
      icon: Bell,
      items: ['Email Alerts', 'Push Notifications', 'Payment Reminders']
    },
    { 
      title: 'Billing & Plans', 
      description: 'Manage your SaaS subscription',
      icon: CreditCard,
      items: ['Current Plan', 'Payment Methods', 'Invoice History']
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient">Settings</h2>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="grid gap-6">
          {sections.map((section) => (
            <Card key={section.title} className="border-none shadow-md bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <section.icon className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {section.items.map((item) => (
                    <button 
                      key={item}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors text-sm group"
                    >
                      <span className="font-medium">{item}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-end gap-3 pt-6">
          <Button variant="ghost">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
