import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Download, Mail, Phone, MapPin, Award, TrendingUp, Gift } from "lucide-react";

const UserManagement = () => {
  const users = [
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91 98765 43210",
      userType: "Painter",
      tier: "Gold",
      points: 2450,
      totalEarned: 15670,
      totalRedeemed: 13220,
      location: "Mumbai, Maharashtra",
      joinDate: "2023-08-15",
      lastActive: "2024-01-10",
      status: "Active"
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91 87654 32109",
      userType: "Contractor",
      tier: "Platinum",
      points: 5890,
      totalEarned: 28450,
      totalRedeemed: 22560,
      location: "Delhi NCR",
      joinDate: "2023-05-20",
      lastActive: "2024-01-12",
      status: "Active"
    },
    {
      id: 3,
      name: "Mohammed Ali",
      email: "mohammed.ali@email.com",
      phone: "+91 76543 21098",
      userType: "AID",
      tier: "Silver",
      points: 1230,
      totalEarned: 8790,
      totalRedeemed: 7560,
      location: "Bangalore, Karnataka",
      joinDate: "2023-12-01",
      lastActive: "2024-01-08",
      status: "Active"
    },
    {
      id: 4,
      name: "Anita Gupta",
      email: "anita.gupta@email.com",
      phone: "+91 65432 10987",
      userType: "Painter",
      tier: "Bronze",
      points: 890,
      totalEarned: 4560,
      totalRedeemed: 3670,
      location: "Pune, Maharashtra",
      joinDate: "2024-01-05",
      lastActive: "2024-01-11",
      status: "Active"
    },
    {
      id: 5,
      name: "Sanjay Patel",
      email: "sanjay.patel@email.com",
      phone: "+91 54321 09876",
      userType: "Contractor",
      tier: "Gold",
      points: 0,
      totalEarned: 12340,
      totalRedeemed: 12340,
      location: "Ahmedabad, Gujarat",
      joinDate: "2023-09-10",
      lastActive: "2023-12-25",
      status: "Inactive"
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'bg-gradient-to-r from-slate-400 to-slate-600 text-white';
      case 'Gold':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 'Silver':
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 'Bronze':
        return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'Painter':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Contractor':
        return 'bg-success/10 text-success border-success/20';
      case 'AID':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage painters, contractors, and AIDs in your loyalty program</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Users
          </Button>
          <Button className="bg-gradient-primary text-primary-foreground shadow-glass">
            <Mail className="mr-2 h-4 w-4" />
            Send Notification
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border shadow-enterprise bg-gradient-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,650</div>
            <p className="text-xs text-success">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-enterprise bg-gradient-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,420</div>
            <p className="text-xs text-success">86% engagement rate</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-enterprise bg-gradient-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gold+ Tier Users</CardTitle>
            <Gift className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">342</div>
            <p className="text-xs text-success">21% of total users</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-enterprise bg-gradient-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Points Balance</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2,290</div>
            <p className="text-xs text-success">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-border shadow-enterprise">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2 flex-1 min-w-60">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users by name, email, or phone..." className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="painter">Painter</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                  <SelectItem value="aid">AID</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="border-border shadow-enterprise bg-gradient-secondary">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{user.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {user.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTierColor(user.tier)}>
                        {user.tier}
                      </Badge>
                      <Badge className={getUserTypeColor(user.userType)}>
                        {user.userType}
                      </Badge>
                      <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-lg bg-card border border-border">
                      <div className="text-lg font-bold text-foreground">{user.points.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Current Points</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-card border border-border">
                      <div className="text-lg font-bold text-foreground">{user.totalEarned.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Total Earned</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-card border border-border">
                      <div className="text-lg font-bold text-foreground">{user.totalRedeemed.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Total Redeemed</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-card border border-border">
                      <div className="text-sm font-medium text-foreground">{user.lastActive}</div>
                      <div className="text-xs text-muted-foreground">Last Active</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="text-sm text-muted-foreground">
                      Member since {user.joinDate}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        Send Message
                      </Button>
                      <Button variant="outline" size="sm">
                        Transaction History
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;