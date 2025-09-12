import * as React from "react";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  Users,
  Trophy,
  Zap,
  TrendingUp,
  Settings,
  Bell,
  Award,
  Target,
  Gift,
  Star,
} from "lucide-react";

import SchemeManagement from "./SchemeManagement";
import UserManagement from "./UserManagement";
import RuleEngine from "./RuleEngine";
import ReportingDashboard from "./ReportingDashboard";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "schemes" | "users" | "rules" | "reporting">("dashboard");

  // Mock data (memoized)
  const monthlyData = useMemo(
    () => [
      { month: "Jan", points: 12000, users: 850, schemes: 5 },
      { month: "Feb", points: 15000, users: 920, schemes: 7 },
      { month: "Mar", points: 18000, users: 1100, schemes: 9 },
      { month: "Apr", points: 22000, users: 1250, schemes: 12 },
      { month: "May", points: 28000, users: 1400, schemes: 15 },
      { month: "Jun", points: 32000, users: 1650, schemes: 18 },
    ],
    []
  );

  const userTypeData = useMemo(
    () => [
      { name: "Painters", value: 45, color: "#8B5CF6" },
      { name: "Contractors", value: 35, color: "#06B6D4" },
      { name: "AIDs", value: 20, color: "#10B981" },
    ],
    []
  );

  const topSchemes = useMemo(
    () => [
      { name: "New User Bonus", participants: 1200, points: 24000, status: "Active" },
      { name: "Referral Program", participants: 850, points: 17000, status: "Active" },
      { name: "Monthly Challenge", participants: 650, points: 13000, status: "Active" },
      { name: "Lucky Draw Q2", participants: 2100, points: 0, status: "Completed" },
    ],
    []
  );

  return (
    <SidebarProvider>
      {/* Skip link for a11y */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {/* App Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/60 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-3 md:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Trophy className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-lg md:text-xl font-bold text-foreground">
                Loyalty Engine
              </h1>
            </div>
            <Badge variant="secondary" className="ml-2 bg-accent text-accent-foreground">
              Enterprise Portal
            </Badge>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Layout: Sidebar + Inset Content */}
      <div className="flex w-full" data-variant="inset">
        <Sidebar variant="sidebar" collapsible="icon" side="left" className="bg-card/30 backdrop-blur-sm">
          <SidebarHeader>
            <SidebarGroupLabel className="text-xs uppercase tracking-wide">
              Navigation
            </SidebarGroupLabel>
          </SidebarHeader>

          <SidebarContent id="primary-sidebar">
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "dashboard"}
                    onClick={() => setActiveTab("dashboard")}
                    tooltip="Dashboard"
                  >
                    <TrendingUp className="shrink-0" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "schemes"}
                    onClick={() => setActiveTab("schemes")}
                    tooltip="Scheme Management"
                  >
                    <Zap className="shrink-0" />
                    <span>Scheme Management</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "users"}
                    onClick={() => setActiveTab("users")}
                    tooltip="User Management"
                  >
                    <Users className="shrink-0" />
                    <span>User Management</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "rules"}
                    onClick={() => setActiveTab("rules")}
                    tooltip="Rule Engine"
                  >
                    <Target className="shrink-0" />
                    <span>Rule Engine</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "reporting"}
                    onClick={() => setActiveTab("reporting")}
                    tooltip="Reporting"
                  >
                    <Award className="shrink-0" />
                    <span>Reporting</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarSeparator />

                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Rewards Catalog">
                    <Gift className="shrink-0" />
                    <span>Rewards Catalog</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Communications">
                    <Bell className="shrink-0" />
                    <span>Communications</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Analytics">
                    <TrendingUp className="shrink-0" />
                    <span>Analytics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <p className="px-2 text-xs text-muted-foreground">
              ⌘/Ctrl + B to toggle
            </p>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <SidebarInset className="p-4 md:p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card className="border-border shadow-enterprise bg-gradient-secondary">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">1,650</div>
                    <p className="text-xs text-success">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-enterprise bg-gradient-secondary">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Points Distributed
                    </CardTitle>
                    <Star className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">32K</div>
                    <p className="text-xs text-success">+8% from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-enterprise bg-gradient-secondary">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Schemes
                    </CardTitle>
                    <Zap className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">18</div>
                    <p className="text-xs text-success">+3 new schemes</p>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-enterprise bg-gradient-secondary">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Engagement Rate
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">84%</div>
                    <p className="text-xs text-success">+5% from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="schemes">Schemes</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Trends */}
                    <Card className="border-border shadow-enterprise">
                      <CardHeader>
                        <CardTitle className="text-foreground">Monthly Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={monthlyData}>
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
                              data={userTypeData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}%`}
                            >
                              {userTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="schemes" className="space-y-6 pt-4">
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
                        {topSchemes.map((scheme, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border border-border rounded-lg bg-gradient-secondary"
                          >
                            <div className="space-y-1">
                              <h3 className="font-medium text-foreground">{scheme.name}</h3>
                              <div className="flex gap-4 text-sm text-muted-foreground">
                                <span>{scheme.participants} participants</span>
                                <span>{scheme.points} points distributed</span>
                              </div>
                            </div>
                            <Badge
                              variant={scheme.status === "Active" ? "default" : "secondary"}
                              className={
                                scheme.status === "Active"
                                  ? "bg-gradient-success text-success-foreground"
                                  : ""
                              }
                            >
                              {scheme.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-6 pt-4">
                  {/* User Activity */}
                  <Card className="border-border shadow-enterprise">
                    <CardHeader>
                      <CardTitle className="text-foreground">User Activity Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RBarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </RBarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === "schemes" && <SchemeManagement />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "rules" && <RuleEngine />}
          {activeTab === "reporting" && <ReportingDashboard />}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
