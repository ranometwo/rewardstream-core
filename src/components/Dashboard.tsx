import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, Trophy, Zap, TrendingUp, Settings, Bell, Award, Target, Gift, Star } from "lucide-react";
import SchemeManagement from "./SchemeManagement";
import UserManagement from "./UserManagement";
import RuleEngine from "./RuleEngine";
import ReportingDashboard from "./ReportingDashboard";
import { useState } from "react";
import { Menu } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Mock data for analytics
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
    { name: 'New User Bonus', participants: 1200, points: 24000, status: 'Active' },
    { name: 'Referral Program', participants: 850, points: 17000, status: 'Active' },
    { name: 'Monthly Challenge', participants: 650, points: 13000, status: 'Active' },
    { name: 'Lucky Draw Q2', participants: 2100, points: 0, status: 'Completed' },
  ];

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
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Enterprise Portal
            </Badge>
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

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className={`${sidebarCollapsed ? 'w-16' : 'w-64'} border-r border-border bg-card/30 backdrop-blur-sm min-h-[calc(100vh-4rem)] transition-all duration-300 relative`}>
          {/* Collapse Icon */}
          <div className="absolute top-4 right-3 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-6 w-6 hover:bg-accent"
            >
              <Menu className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-2 pt-4 px-4">
            <Button 
              variant={activeTab === "dashboard" ? "enterprise" : "ghost"} 
              className={`w-full ${sidebarCollapsed ? 'px-2 justify-center' : 'justify-start'}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <TrendingUp className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-2'}`} />
              {!sidebarCollapsed && "Dashboard"}
            </Button>
            <Button 
              variant={activeTab === "schemes" ? "enterprise" : "ghost"} 
              className={`w-full ${sidebarCollapsed ? 'px-2 justify-center' : 'justify-start'}`}
              onClick={() => setActiveTab("schemes")}
            >
              <Zap className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-2'}`} />
              {!sidebarCollapsed && "Scheme Management"}
            </Button>
            <Button 
              variant={activeTab === "users" ? "enterprise" : "ghost"} 
              className={`w-full ${sidebarCollapsed ? 'px-2 justify-center' : 'justify-start'}`}
              onClick={() => setActiveTab("users")}
            >
              <Users className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-2'}`} />
              {!sidebarCollapsed && "User Management"}
            </Button>
            <Button 
              variant={activeTab === "rules" ? "enterprise" : "ghost"} 
              className={`w-full ${sidebarCollapsed ? 'px-2 justify-center' : 'justify-start'}`}
              onClick={() => setActiveTab("rules")}
            >
              <Target className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-2'}`} />
              {!sidebarCollapsed && "Rule Engine"}
            </Button>
            <Button 
              variant={activeTab === "reporting" ? "enterprise" : "ghost"} 
              className={`w-full ${sidebarCollapsed ? 'px-2 justify-center' : 'justify-start'}`}
              onClick={() => setActiveTab("reporting")}
            >
              <Award className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-2'}`} />
              {!sidebarCollapsed && "Reporting"}
            </Button>
            <Button variant="ghost" className={`w-full ${sidebarCollapsed ? 'px-2 justify-center' : 'justify-start'}`}>
              <Gift className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-2'}`} />
              {!sidebarCollapsed && "Rewards Catalog"}
            </Button>
            <Button variant="ghost" className={`w-full ${sidebarCollapsed ? 'px-2 justify-center' : 'justify-start'}`}>
              <Bell className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-2'}`} />
              {!sidebarCollapsed && "Communications"}
            </Button>
            <Button variant="ghost" className={`w-full ${sidebarCollapsed ? 'px-2 justify-center' : 'justify-start'}`}>
              <TrendingUp className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-2'}`} />
              {!sidebarCollapsed && "Analytics"}
            </Button>
           </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border shadow-enterprise bg-gradient-secondary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">1,650</div>
                <p className="text-xs text-success">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-enterprise bg-gradient-secondary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Points Distributed</CardTitle>
                <Star className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">32K</div>
                <p className="text-xs text-success">+8% from last month</p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-enterprise bg-gradient-secondary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Schemes</CardTitle>
                <Zap className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">18</div>
                <p className="text-xs text-success">+3 new schemes</p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-enterprise bg-gradient-secondary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Rate</CardTitle>
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

            <TabsContent value="overview" className="space-y-6">
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
                          fill="#8884d8"
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
                    {topSchemes.map((scheme, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg bg-gradient-secondary">
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
                    <BarChart data={monthlyData}>
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
          {activeTab === "schemes" && <SchemeManagement />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "rules" && <RuleEngine />}
          {activeTab === "reporting" && <ReportingDashboard />}
    </main>
      </div>
    </div>
  );
};

export default Dashboard;