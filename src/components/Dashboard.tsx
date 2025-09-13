import React, { useState, useRef, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, Trophy, Zap, TrendingUp, Settings, Bell, Award, Target, Gift, Star, PanelLeftClose, PanelLeftOpen, LucideIcon } from "lucide-react";
import SchemeManagement from "./SchemeManagement";
import UserManagement from "./UserManagement";
import RuleEngine from "./RuleEngine";
import ReportingDashboard from "./ReportingDashboard";

type TabType = "dashboard" | "schemes" | "users" | "rules" | "reporting";

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

interface NavigationItem {
  id: TabType | string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}

interface TextVisibility {
  showText: boolean;
  fadeText: boolean;
  iconSpacing: string;
  iconMargin: string;
}

interface KPICard {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color?: string;
}

const BREAKPOINTS = {
  ICON_ONLY: 40,
  NARROW_TEXT: 180,
  COMFORTABLE: 200,
  MOBILE: 768,
  TABLET: 1024,
} as const;

const SIDEBAR_CONFIG = {
  COLLAPSED_WIDTH: 40,
  EXPANDED_WIDTH: 180,
  CONTAINER_PADDING: 24,
  DEFAULT_SIZE: 23,
  MIN_SIZE: 4,
  MAX_SIZE: 40,
} as const;

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

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const panelGroupRef = useRef<any>(null);

  const handleLayoutChange = useCallback((sizes: number[]) => {
    const containerWidth = window.innerWidth - SIDEBAR_CONFIG.CONTAINER_PADDING;
    const actualPixelWidth = (sizes[0] / 100) * containerWidth;

    setSidebarWidth(actualPixelWidth);

    const shouldBeCollapsed = actualPixelWidth <= BREAKPOINTS.ICON_ONLY;

    if (shouldBeCollapsed !== sidebarCollapsed) {
      setSidebarCollapsed(shouldBeCollapsed);

      if (shouldBeCollapsed && panelGroupRef.current) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            const collapsedPercentage = (SIDEBAR_CONFIG.COLLAPSED_WIDTH / containerWidth) * 100;
            panelGroupRef.current?.setLayout([collapsedPercentage, 100 - collapsedPercentage]);
          }, 16);
        });
      }
    }
  }, [sidebarCollapsed]);

  const toggleSidebar = useCallback(() => {
    const containerWidth = window.innerWidth - SIDEBAR_CONFIG.CONTAINER_PADDING;

    if (sidebarCollapsed) {
      const targetPercentage = Math.min((SIDEBAR_CONFIG.EXPANDED_WIDTH / containerWidth) * 100, 35);
      setSidebarWidth(SIDEBAR_CONFIG.EXPANDED_WIDTH);
      setSidebarCollapsed(false);

      requestAnimationFrame(() => {
        setTimeout(() => {
          panelGroupRef.current?.setLayout?.([targetPercentage, 100 - targetPercentage]);
        }, 20);
      });
    } else {
      const collapsedPercentage = (SIDEBAR_CONFIG.COLLAPSED_WIDTH / containerWidth) * 100;
      setSidebarWidth(SIDEBAR_CONFIG.COLLAPSED_WIDTH);
      setSidebarCollapsed(true);

      requestAnimationFrame(() => {
        setTimeout(() => {
          panelGroupRef.current?.setLayout?.([collapsedPercentage, 100 - collapsedPercentage]);
        }, 20);
      });
    }
  }, [sidebarCollapsed]);

  const textVisibility = useMemo((): TextVisibility => {
    if (sidebarWidth < BREAKPOINTS.ICON_ONLY) {
      return { showText: false, fadeText: false, iconSpacing: 'justify-center', iconMargin: '' };
    }
    if (sidebarWidth < BREAKPOINTS.NARROW_TEXT) {
      return { showText: true, fadeText: true, iconSpacing: 'justify-start', iconMargin: 'mr-2' };
    }
    return { showText: true, fadeText: false, iconSpacing: 'justify-start', iconMargin: 'mr-2' };
  }, [sidebarWidth]);

  const { showText, fadeText, iconSpacing, iconMargin } = textVisibility;

  const navigationItems = useMemo((): NavigationItem[] => [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "schemes", label: "Schemes", icon: Zap },
    { id: "users", label: "Users", icon: Users },
    { id: "rules", label: "Rules", icon: Target },
    { id: "reporting", label: "Reports", icon: Award },
    { id: "rewards", label: "Rewards", icon: Gift },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ], []);

  const NavButton = React.memo<{
    item: NavigationItem;
    isActive: boolean;
    onClick: () => void;
  }>(({ item, isActive, onClick }) => (
    <Button
      variant={isActive ? "enterprise" : "ghost"}
      className={`w-full transition-all duration-200 ${iconSpacing}`}
      onClick={onClick}
    >
      <item.icon className={`h-4 w-4 flex-shrink-0 ${iconMargin}`} />
      {showText && (
        <span
          className={cn(
            "truncate transition-opacity duration-200",
            fadeText && "opacity-70"
          )}
          style={fadeText ? {
            maskImage: 'linear-gradient(to right, black 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent 100%)'
          } : {}}
        >
          {item.label}
        </span>
      )}
    </Button>
  ));

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Trophy className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Loyalty Engine</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-6 w-6 hover:bg-accent ml-2 transition-all duration-200 hover:scale-110"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="h-3 w-3" /> : <PanelLeftClose className="h-3 w-3" />}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[calc(100vh-4rem)]"
        onLayout={handleLayoutChange}
        ref={panelGroupRef}
      >
        <ResizablePanel
          defaultSize={SIDEBAR_CONFIG.DEFAULT_SIZE}
          minSize={SIDEBAR_CONFIG.MIN_SIZE}
          maxSize={SIDEBAR_CONFIG.MAX_SIZE}
          className="border-r border-border bg-card/30 backdrop-blur-sm"
        >
          <nav className="h-full">
            <div className="space-y-2 pt-4 px-2">
              {navigationItems.slice(0, 5).map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  isActive={activeTab === item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                />
              ))}

              {navigationItems.slice(5).map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  isActive={false}
                  onClick={() => {}}
                />
              ))}
            </div>
          </nav>
        </ResizablePanel>

        <ResizableHandle className="w-1 bg-border hover:bg-border/80 transition-colors duration-200" />

        <ResizablePanel defaultSize={77} minSize={50}>
          <main className="p-6 h-full overflow-auto">
            {activeTab === "dashboard" && (
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
            )}
            {activeTab === "schemes" && (
              <React.Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
                <SchemeManagement />
              </React.Suspense>
            )}
            {activeTab === "users" && (
              <React.Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
                <UserManagement />
              </React.Suspense>
            )}
            {activeTab === "rules" && (
              <React.Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
                <RuleEngine />
              </React.Suspense>
            )}
            {activeTab === "reporting" && (
              <React.Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
                <ReportingDashboard />
              </React.Suspense>
            )}
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

Dashboard.displayName = 'Dashboard';

export default React.memo(Dashboard);