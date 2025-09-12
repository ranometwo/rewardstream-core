import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { 
  Users, Trophy, Zap, TrendingUp, Settings, Bell, Award, Target, 
  Gift, Star, Activity, ArrowUp, ArrowDown, MoreVertical, Search, 
  Filter, Download, Calendar, ChevronRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import SchemeManagement from "./SchemeManagement";
import UserManagement from "./UserManagement";
import RuleEngine from "./RuleEngine";
import ReportingDashboard from "./ReportingDashboard";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// KPI Card Component
const KPICard = ({ title, value, change, icon: Icon, trend = "up" }) => {
  const isPositive = trend === "up";
  
  return (
    <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold text-foreground mb-1 tabular-nums">
          {value}
        </div>
        <div className="flex items-center gap-1">
          {isPositive ? (
            <ArrowUp className="h-3 w-3 text-success" />
          ) : (
            <ArrowDown className="h-3 w-3 text-destructive" />
          )}
          <p className={cn(
            "text-xs font-medium",
            isPositive ? "text-success" : "text-destructive"
          )}>
            {change}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("30d");
  
  // Animation states
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  // Mock data
  const monthlyData = [
    { month: 'Jan', points: 12000, users: 850, schemes: 5 },
    { month: 'Feb', points: 15000, users: 920, schemes: 7 },
    { month: 'Mar', points: 18000, users: 1100, schemes: 9 },
    { month: 'Apr', points: 22000, users: 1250, schemes: 12 },
    { month: 'May', points: 28000, users: 1400, schemes: 15 },
    { month: 'Jun', points: 32000, users: 1650, schemes: 18 },
  ];

  const userTypeData = [
    { name: 'Painters', value: 45, color: '#8B5CF6' },
    { name: 'Contractors', value: 35, color: '#06B6D4' },
    { name: 'AIDs', value: 20, color: '#10B981' },
  ];

  const topSchemes = [
    { name: 'New User Bonus', participants: 1200, points: 24000, status: 'Active', growth: '+12%' },
    { name: 'Referral Program', participants: 850, points: 17000, status: 'Active', growth: '+8%' },
    { name: 'Monthly Challenge', participants: 650, points: 13000, status: 'Active', growth: '+5%' },
    { name: 'Lucky Draw Q2', participants: 2100, points: 0, status: 'Completed', growth: '0%' },
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, badge: null },
    { id: 'schemes', label: 'Scheme Management', icon: Zap, badge: '3 New' },
    { id: 'users', label: 'User Management', icon: Users, badge: null },
    { id: 'rules', label: 'Rule Engine', icon: Target, badge: null },
    { id: 'reporting', label: 'Reporting', icon: Award, badge: null },
    { id: 'rewards', label: 'Rewards Catalog', icon: Gift, badge: '12' },
    { id: 'communications', label: 'Communications', icon: Bell, badge: '5' },
    { id: 'analytics', label: 'Analytics', icon: Activity, badge: null },
  ];

  const DashboardSidebar = () => {
    const { state } = useSidebar();
    
    return (
      <>
        <SidebarHeader className="border-b border-border/50 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className={cn(
              "transition-all duration-300",
              state === "collapsed" && "opacity-0 w-0"
            )}>
              <h1 className="text-lg font-bold text-foreground">Loyalty Engine</h1>
              <p className="text-xs text-muted-foreground">Enterprise</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {menuItems.slice(0, 5).map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    isActive={activeTab === item.id}
                    tooltip={item.label}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "ml-auto h-5 px-1.5 text-xs",
                          state === "collapsed" && "hidden"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Tools & Settings</SidebarGroupLabel>
            <SidebarMenu>
              {menuItems.slice(5).map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    isActive={activeTab === item.id}
                    tooltip={item.label}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "ml-auto h-5 px-1.5 text-xs",
                          state === "collapsed" && "hidden"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-border/50">
          <div className={cn(
            "flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-accent/50 transition-all cursor-pointer",
            state === "collapsed" && "justify-center"
          )}>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">AD</AvatarFallback>
            </Avatar>
            <div className={cn(
              "flex-1 transition-all duration-300",
              state === "collapsed" && "w-0 opacity-0 overflow-hidden"
            )}>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@loyalty.com</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-8 w-8",
                state === "collapsed" && "hidden"
              )}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </SidebarFooter>
      </>
    );
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-background">
        <Sidebar collapsible="icon" variant="sidebar">
          <DashboardSidebar />
        </Sidebar>
        
        <SidebarInset>
          {/* Header */}
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/50 bg-background/95 backdrop-blur-sm px-6">
            <SidebarTrigger />
            
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center gap-4 flex-1 max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search schemes, users, or reports..." 
                    className="pl-10 bg-card/50 border-border/50 focus:bg-card transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Last {dateRange}</span>
                </Button>
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <div className={cn(
              "transition-all duration-500",
              isLoading ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}>
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {/* Page Title */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                      <p className="text-muted-foreground mt-1">Monitor your loyalty program performance</p>
                    </div>
                    <Button className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all">
                      Generate Report
                    </Button>
                  </div>

                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard 
                      title="Active Users" 
                      value="1,650" 
                      change="+12% from last month" 
                      icon={Users} 
                      trend="up"
                    />
                    <KPICard 
                      title="Points Distributed" 
                      value="32K" 
                      change="+8% from last month" 
                      icon={Star} 
                      trend="up"
                    />
                    <KPICard 
                      title="Active Schemes" 
                      value="18" 
                      change="+3 new schemes" 
                      icon={Zap} 
                      trend="up"
                    />
                    <KPICard 
                      title="Engagement Rate" 
                      value="84%" 
                      change="+5% from last month" 
                      icon={TrendingUp} 
                      trend="up"
                    />
                  </div>

                  {/* Analytics Tabs */}
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-card/50 p-1">
                      <TabsTrigger value="overview" className="data-[state=active]:bg-background">Overview</TabsTrigger>
                      <TabsTrigger value="schemes" className="data-[state=active]:bg-background">Schemes</TabsTrigger>
                      <TabsTrigger value="users" className="data-[state=active]:bg-background">Users</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6 mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Monthly Trends */}
                        <Card className="border-border/50 shadow-lg">
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Monthly Trends</CardTitle>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                              <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <RechartsTooltip 
                                  contentStyle={{ 
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px'
                                  }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="points" 
                                  stroke="hsl(var(--primary))" 
                                  strokeWidth={2}
                                  dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                                  activeDot={{ r: 6 }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="users" 
                                  stroke="hsl(var(--success))" 
                                  strokeWidth={2}
                                  dot={{ r: 4, fill: 'hsl(var(--success))' }}
                                  activeDot={{ r: 6 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        {/* User Distribution */}
                        <Card className="border-border/50 shadow-lg">
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>User Distribution</CardTitle>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                              <PieChart>
                                <Pie
                                  data={userTypeData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={100}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {userTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <RechartsTooltip />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="flex justify-center gap-6 mt-4">
                              {userTypeData.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                  <span className="text-sm text-muted-foreground">{item.name}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="schemes" className="space-y-6 mt-6">
                      <Card className="border-border/50 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div>
                            <CardTitle>Top Performing Schemes</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">Track your most successful loyalty schemes</p>
                          </div>
                          <Button className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                            Create New Scheme
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {topSchemes.map((scheme, index) => (
                              <div 
                                key={index} 
                                className="group flex items-center justify-between p-4 border border-border/50 rounded-xl bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-200 cursor-pointer"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Trophy className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-foreground">{scheme.name}</h3>
                                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                      <span className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {scheme.participants} participants
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Star className="h-3 w-3" />
                                        {scheme.points} points
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={cn(
                                    "text-sm font-medium",
                                    scheme.growth.startsWith('+') ? "text-success" : "text-muted-foreground"
                                  )}>
                                    {scheme.growth}
                                  </span>
                                  <Badge 
                                    variant={scheme.status === 'Active' ? 'default' : 'secondary'}
                                    className={cn(
                                      scheme.status === 'Active' && "bg-success/10 text-success border-success/20"
                                    )}
                                  >
                                    {scheme.status}
                                  </Badge>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="users" className="space-y-6 mt-6">
                      <Card className="border-border/50 shadow-lg">
                        <CardHeader>
                          <CardTitle>User Activity Trends</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">Monthly user engagement overview</p>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={monthlyData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <RechartsTooltip 
                                contentStyle={{ 
                                  backgroundColor: 'hsl(var(--card))',
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px'
                                }}
                              />
                              <Bar 
                                dataKey="users" 
                                fill="hsl(var(--primary))" 
                                radius={[8, 8, 0, 0]}
                                animationDuration={1000}
                              />
                            </BarChart>
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
              
              {!["dashboard", "schemes", "users", "rules", "reporting"].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Activity className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md">
                    This section is currently under development. Check back soon for updates!
                  </p>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;