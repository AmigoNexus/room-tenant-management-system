'use client';

import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const monthlyData = [
  { month: 'Jan', revenue: 4000, maintenance: 800, profit: 3200 },
  { month: 'Feb', revenue: 4200, maintenance: 900, profit: 3300 },
  { month: 'Mar', revenue: 4500, maintenance: 850, profit: 3650 },
  { month: 'Apr', revenue: 4800, maintenance: 1000, profit: 3800 },
  { month: 'May', revenue: 5100, maintenance: 950, profit: 4150 },
];

const occupancyData = [
  { name: 'Occupied', value: 75, color: 'hsl(var(--primary))' },
  { name: 'Vacant', value: 20, color: 'hsl(var(--muted))' },
  { name: 'Maintenance', value: 5, color: 'hsl(var(--destructive))' },
];

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gradient">Reports & Analytics</h2>
            <p className="text-muted-foreground">Deep dive into your property performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Calendar className="w-4 h-4 mr-2" /> May 2026</Button>
            <Button><Download className="w-4 h-4 mr-2" /> Download Report</Button>
          </div>
        </div>

        <Tabs defaultValue="financial" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
            <TabsTrigger value="tenants">Tenants</TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Revenue vs Expenses</CardTitle>
                  <CardDescription>Monthly financial performance</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" name="Total Revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="maintenance" name="Expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} opacity={0.6} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Profit Margin Trend</CardTitle>
                  <CardDescription>Net profit growth over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                         contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      />
                      <Line type="monotone" dataKey="profit" name="Net Profit" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 6, fill: 'hsl(var(--primary))' }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="occupancy">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Current Status Distribution</CardTitle>
                  <CardDescription>Breakdown of all units</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={occupancyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {occupancyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm p-6 flex flex-col justify-center space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase">Key Insights</h4>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Occupancy is up by 12% compared to Q1 2026.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>Average rent per unit has increased by $150.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>5 units currently require maintenance attention.</span>
                    </li>
                  </ul>
                </div>
                <Button className="w-full">View Detailed Unit Logs</Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
