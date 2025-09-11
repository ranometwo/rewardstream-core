import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Play, Pause, BarChart3, Users, Calendar, Target } from "lucide-react";

const SchemeManagement = () => {
  const schemes = [
    {
      id: 1,
      name: "New User Welcome Bonus",
      type: "Bonus",
      status: "Active",
      participants: 1200,
      pointsDistributed: 24000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      description: "Welcome bonus for new users joining the loyalty program"
    },
    {
      id: 2,
      name: "Contractor Referral Program",
      type: "Referral",
      status: "Active",
      participants: 850,
      pointsDistributed: 17000,
      startDate: "2024-02-01",
      endDate: "2024-06-30",
      description: "Earn points for referring new contractors to the platform"
    },
    {
      id: 3,
      name: "Monthly Purchase Challenge",
      type: "Gamification",
      status: "Active",
      participants: 650,
      pointsDistributed: 13000,
      startDate: "2024-03-01",
      endDate: "2024-03-31",
      description: "Complete purchase challenges to earn bonus points"
    },
    {
      id: 4,
      name: "Q2 Lucky Draw",
      type: "Lucky Draw",
      status: "Completed",
      participants: 2100,
      pointsDistributed: 0,
      startDate: "2024-04-01",
      endDate: "2024-06-30",
      description: "Quarterly lucky draw with premium rewards"
    },
    {
      id: 5,
      name: "Painter Tier Upgrade Bonus",
      type: "Bonus",
      status: "Draft",
      participants: 0,
      pointsDistributed: 0,
      startDate: "2024-07-01",
      endDate: "2024-09-30",
      description: "Bonus points for painters achieving higher tiers"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-gradient-success text-success-foreground';
      case 'Draft':
        return 'bg-muted text-muted-foreground';
      case 'Completed':
        return 'bg-accent text-accent-foreground';
      case 'Paused':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Bonus':
        return <Target className="h-4 w-4" />;
      case 'Referral':
        return <Users className="h-4 w-4" />;
      case 'Gamification':
        return <BarChart3 className="h-4 w-4" />;
      case 'Lucky Draw':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Scheme Management</h1>
          <p className="text-muted-foreground">Configure and manage bonus schemes, referrals, and gamification</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-primary-foreground shadow-glass">
              <Plus className="mr-2 h-4 w-4" />
              Create New Scheme
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Loyalty Scheme</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schemeName">Scheme Name</Label>
                  <Input id="schemeName" placeholder="Enter scheme name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schemeType">Scheme Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bonus">Bonus Scheme</SelectItem>
                      <SelectItem value="referral">Referral Program</SelectItem>
                      <SelectItem value="gamification">Gamification</SelectItem>
                      <SelectItem value="luckydraw">Lucky Draw</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the scheme objectives and rules" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-gradient-primary text-primary-foreground">Create Scheme</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-border shadow-enterprise">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <Label>Filter by Status</Label>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Filter by Type</Label>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="bonus">Bonus</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="gamification">Gamification</SelectItem>
                  <SelectItem value="luckydraw">Lucky Draw</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search</Label>
              <Input placeholder="Search schemes..." className="w-60" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schemes Grid */}
      <div className="grid gap-6">
        {schemes.map((scheme) => (
          <Card key={scheme.id} className="border-border shadow-enterprise bg-gradient-secondary">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-accent">
                    {getTypeIcon(scheme.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground">{scheme.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{scheme.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(scheme.status)}>
                    {scheme.status}
                  </Badge>
                  <Badge variant="outline" className="text-primary border-primary/20">
                    {scheme.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 rounded-lg bg-card border border-border">
                  <div className="text-2xl font-bold text-foreground">{scheme.participants.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Participants</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-card border border-border">
                  <div className="text-2xl font-bold text-foreground">{scheme.pointsDistributed.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Points Distributed</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-card border border-border">
                  <div className="text-sm font-medium text-foreground">{scheme.startDate}</div>
                  <div className="text-sm text-muted-foreground">Start Date</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-card border border-border">
                  <div className="text-sm font-medium text-foreground">{scheme.endDate}</div>
                  <div className="text-sm text-muted-foreground">End Date</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {scheme.status === 'Active' && (
                    <Button variant="outline" size="sm">
                      <Pause className="mr-2 h-3 w-3" />
                      Pause
                    </Button>
                  )}
                  {scheme.status === 'Draft' && (
                    <Button size="sm" className="bg-gradient-success text-success-foreground">
                      <Play className="mr-2 h-3 w-3" />
                      Activate
                    </Button>
                  )}
                  {scheme.status === 'Paused' && (
                    <Button size="sm" className="bg-gradient-success text-success-foreground">
                      <Play className="mr-2 h-3 w-3" />
                      Resume
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="mr-2 h-3 w-3" />
                    Analytics
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 className="mr-2 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SchemeManagement;