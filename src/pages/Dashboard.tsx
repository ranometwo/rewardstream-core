import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, Star, Zap, TrendingUp, LucideIcon } from "lucide-react";
import Layout from "@/components/Layout";

interface MonthlyData {
  month: string;
  points: number;
  users: number;
  schemes: number;
}

interface UserTypeData {
  name: string;
  value: number;
  color: string;
}

interface Scheme {
  name: string;
  participants: number;
  points: number;
  status: "Active" | "Completed";
}

interface KPICard {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color?: string;
}

const MOCK_DATA = {
  monthlyData: [
    { month: 'Jan', points: 12000, users: 850, schemes: 5 },
    { month: 'Feb', points: 15000, users: 920, schemes: 7 },
    { month: 'Mar', points: 18000, users: 1100, schemes: 9 },
    { month: 'Apr', points: 22000, users: 1250, schemes: 12 },
    { month: 'May', points: 28000, users: 1400, schemes: 15 },
    { month: 'Jun', points: 32000, users: 1650, schemes: 18 },
  ] as MonthlyData[],

  userTypeData: [
    { name: 'Painters', value: 45, color: '#8B5CF6' },
    { name: 'Contractors', value: 35, color: '#06B6D4' },
    { name: 'AIDs', value: 20, color: '#10B981' },
  ] as UserTypeData[],

  topSchemes: [
    { name: 'New User Bonus', participants: 1200, points: 24000, status: 'Active' as const },
    { name: 'Referral Program', participants: 850, points: 17000, status: 'Active' as const },
    { name: 'Monthly Challenge', participants: 650, points: 13000, status: 'Active' as const },
    { name: 'Lucky Draw Q2', participants: 2100, points: 0, status: 'Completed' as const },
  ] as Scheme[],

  kpiCards: [
    { title: "Active Users", value: "1,650", change: "+12% from last month", icon: Users },
    { title: "Points Distributed", value: "32K", change: "+8% from last month", icon: Star },
    { title: "Active Schemes", value: "18", change: "+3 new schemes", icon: Zap },
    { title: "Engagement Rate", value: "84%", change: "+5% from last month", icon: TrendingUp },
  ] as KPICard[],
} as const;

const KPICardComponent = React.memo<{ data: KPICard }>(({ data }) => (
  <Card className="border-border shadow-enterprise bg-gradient-secondary">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{data.title}</CardTitle>
      <data.icon className="h-4 w-4 text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{data.value}</div>
      <p className="text-xs text-success">{data.change}</p>
    </CardContent>
  </Card>
));

const SchemeCard = React.memo<{ scheme: Scheme; index: number }>(({ scheme, index }) => (
  <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-gradient-secondary">
    <div className="space-y-1">
      <h3 className="font-medium text-foreground">{scheme.name}</h3>
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>{scheme.participants} participants</span>
        <span>{scheme.points} points distributed</span>
      </div>
    </div>
    <Badge
      variant={scheme.status === 'Active' ? 'default' : 'secondary'}
      className={scheme.status === 'Active' ? 'bg-gradient-success text-success-foreground' : ''}
    >
      {scheme.status}
    </Badge>
  </div>
));

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_DATA.kpiCards.map((card, index) => (
            <KPICardComponent key={`kpi-${index}`} data={card} />
          ))}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schemes">Schemes</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends */}
              <Card className="border-border shadow-enterprise">
                <CardHeader>
                  <CardTitle className="text-foreground">Monthly Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={MOCK_DATA.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Line type="monotone" dataKey="points" stroke="hsl(var(--primary))" strokeWidth={2} />
                      <Line type="monotone" dataKey="users" stroke="hsl(var(--success))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Distribution */}
              <Card className="border-border shadow-enterprise">
                <CardHeader>
                  <CardTitle className="text-foreground">User Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={MOCK_DATA.userTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {MOCK_DATA.userTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schemes" className="space-y-6">
            {/* Top Performing Schemes */}
            <Card className="border-border shadow-enterprise">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Top Performing Schemes</CardTitle>
                <Button className="bg-gradient-primary text-primary-foreground shadow-glass">
                  Create New Scheme
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_DATA.topSchemes.map((scheme, index) => (
                    <SchemeCard key={`scheme-${scheme.name}-${index}`} scheme={scheme} index={index} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* User Activity */}
            <Card className="border-border shadow-enterprise">
              <CardHeader>
                <CardTitle className="text-foreground">User Activity Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={MOCK_DATA.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;