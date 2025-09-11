import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Settings, Play, Pause, Code, Zap, Target, Award, Users, Calendar, Filter, GitBranch } from "lucide-react";

const RuleEngine = () => {
  const rules = [
    {
      id: 1,
      name: "New User Welcome Points",
      type: "Bonus Rule",
      condition: "user.isFirstTime == true",
      action: "award 500 points",
      status: "Active",
      triggerCount: 1200,
      successRate: 100,
      lastTriggered: "2024-01-12 10:30"
    },
    {
      id: 2,
      name: "Monthly Purchase Milestone",
      type: "Gamification Rule",
      condition: "user.monthlyPurchases >= 10 AND user.tier == 'Gold'",
      action: "award 1000 bonus points + tier upgrade",
      status: "Active",
      triggerCount: 85,
      successRate: 97,
      lastTriggered: "2024-01-12 09:45"
    },
    {
      id: 3,
      name: "Referral Chain Bonus",
      type: "Referral Rule",
      condition: "referral.chain.length > 3",
      action: "award 250 points to all chain members",
      status: "Active",
      triggerCount: 42,
      successRate: 95,
      lastTriggered: "2024-01-11 16:20"
    },
    {
      id: 4,
      name: "Tier Downgrade Protection",
      type: "Retention Rule",
      condition: "user.inactivityDays > 90 AND user.tier >= 'Silver'",
      action: "send notification + extend grace period",
      status: "Paused",
      triggerCount: 156,
      successRate: 78,
      lastTriggered: "2024-01-10 14:15"
    }
  ];

  const ruleTemplates = [
    {
      name: "Points Multiplier",
      description: "Multiply points based on user tier or purchase amount",
      category: "Bonus",
      complexity: "Simple"
    },
    {
      name: "Time-based Bonus",
      description: "Award bonus points for actions within specific time windows",
      category: "Gamification",
      complexity: "Medium"
    },
    {
      name: "Cascade Referral",
      description: "Multi-level referral rewards with diminishing returns",
      category: "Referral",
      complexity: "Advanced"
    },
    {
      name: "Loyalty Tier Manager",
      description: "Automatic tier upgrades/downgrades based on activity",
      category: "Tier Management",
      complexity: "Advanced"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-gradient-success text-success-foreground';
      case 'Paused':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Draft':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case 'Bonus Rule':
        return <Award className="h-4 w-4" />;
      case 'Gamification Rule':
        return <Target className="h-4 w-4" />;
      case 'Referral Rule':
        return <Users className="h-4 w-4" />;
      case 'Retention Rule':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple':
        return 'bg-success/10 text-success border-success/20';
      case 'Medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Advanced':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rule Configuration Engine</h1>
          <p className="text-muted-foreground">Design and manage intelligent rules for loyalty schemes and user engagement</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-primary-foreground shadow-glass">
              <Plus className="mr-2 h-4 w-4" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Rule</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList>
                <TabsTrigger value="basic">Basic Setup</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="testing">Testing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ruleName">Rule Name</Label>
                    <Input id="ruleName" placeholder="Enter rule name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ruleType">Rule Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bonus">Bonus Rule</SelectItem>
                        <SelectItem value="gamification">Gamification Rule</SelectItem>
                        <SelectItem value="referral">Referral Rule</SelectItem>
                        <SelectItem value="retention">Retention Rule</SelectItem>
                        <SelectItem value="tier">Tier Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe what this rule does" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="conditions" className="space-y-4">
                <div className="space-y-2">
                  <Label>Rule Conditions (JavaScript-like syntax)</Label>
                  <Textarea 
                    className="font-mono text-sm" 
                    placeholder="user.tier == 'Gold' && user.monthlyPurchases > 5" 
                    rows={6}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Available Variables</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• user.tier</li>
                      <li>• user.points</li>
                      <li>• user.monthlyPurchases</li>
                      <li>• user.isFirstTime</li>
                      <li>• transaction.amount</li>
                      <li>• referral.count</li>
                    </ul>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Operators</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• == (equals)</li>
                      <li>• &gt; &gt;= &lt; &lt;= (comparison)</li>
                      <li>• && (and)</li>
                      <li>• || (or)</li>
                      <li>• ! (not)</li>
                    </ul>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="actions" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Primary Action</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="award_points">Award Points</SelectItem>
                        <SelectItem value="tier_upgrade">Tier Upgrade</SelectItem>
                        <SelectItem value="send_notification">Send Notification</SelectItem>
                        <SelectItem value="unlock_reward">Unlock Reward</SelectItem>
                        <SelectItem value="custom">Custom Action</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pointsAmount">Points Amount</Label>
                      <Input id="pointsAmount" type="number" placeholder="500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="multiplier">Multiplier</Label>
                      <Input id="multiplier" type="number" step="0.1" placeholder="1.0" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="cascading" />
                    <Label htmlFor="cascading">Enable cascading effects</Label>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="testing" className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Test Rule Execution</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Test Data (JSON)</Label>
                      <Textarea 
                        className="font-mono text-sm" 
                        placeholder='{"user": {"tier": "Gold", "points": 1500, "monthlyPurchases": 8}}'
                        rows={4}
                      />
                    </div>
                    <Button variant="outline" className="w-full">
                      <Play className="mr-2 h-3 w-3" />
                      Test Rule
                    </Button>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Test results will appear here...</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border shadow-enterprise bg-gradient-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Rules</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-xs text-success">All systems operational</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-enterprise bg-gradient-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Executions</CardTitle>
            <GitBranch className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,483</div>
            <p className="text-xs text-success">+127 today</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-enterprise bg-gradient-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">97.5%</div>
            <p className="text-xs text-success">+0.3% from yesterday</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-enterprise bg-gradient-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Response Time</CardTitle>
            <Settings className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">24ms</div>
            <p className="text-xs text-success">Excellent performance</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="w-full">
        <TabsList>
          <TabsTrigger value="rules">Active Rules</TabsTrigger>
          <TabsTrigger value="templates">Rule Templates</TabsTrigger>
          <TabsTrigger value="logs">Execution Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id} className="border-border shadow-enterprise bg-gradient-secondary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-accent">
                      {getRuleTypeIcon(rule.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">{rule.name}</CardTitle>
                      <Badge variant="outline" className="mt-1 text-primary border-primary/20">
                        {rule.type}
                      </Badge>
                    </div>
                  </div>
                  <Badge className={getStatusColor(rule.status)}>
                    {rule.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Condition</Label>
                    <code className="block p-2 bg-muted rounded text-sm font-mono">
                      {rule.condition}
                    </code>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Action</Label>
                    <code className="block p-2 bg-muted rounded text-sm font-mono">
                      {rule.action}
                    </code>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-card border border-border">
                    <div className="text-lg font-bold text-foreground">{rule.triggerCount}</div>
                    <div className="text-xs text-muted-foreground">Executions</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-card border border-border">
                    <div className="text-lg font-bold text-foreground">{rule.successRate}%</div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-card border border-border">
                    <div className="text-xs font-medium text-foreground">{rule.lastTriggered}</div>
                    <div className="text-xs text-muted-foreground">Last Triggered</div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-2">
                    {rule.status === 'Active' && (
                      <Button variant="outline" size="sm">
                        <Pause className="mr-2 h-3 w-3" />
                        Pause
                      </Button>
                    )}
                    {rule.status === 'Paused' && (
                      <Button size="sm" className="bg-gradient-success text-success-foreground">
                        <Play className="mr-2 h-3 w-3" />
                        Resume
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Code className="mr-2 h-3 w-3" />
                      Edit Logic
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-3 w-3" />
                      View Logs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ruleTemplates.map((template, index) => (
              <Card key={index} className="border-border shadow-enterprise bg-gradient-secondary">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-foreground">{template.name}</CardTitle>
                    <Badge className={getComplexityColor(template.complexity)}>
                      {template.complexity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-primary border-primary/20">
                      {template.category}
                    </Badge>
                    <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card className="border-border shadow-enterprise">
            <CardHeader>
              <CardTitle>Execution Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm font-mono">
                <div className="p-2 bg-muted rounded">
                  <span className="text-success">✓</span> [2024-01-12 10:30:15] New User Welcome Points: Awarded 500 points to user rajesh.kumar@email.com
                </div>
                <div className="p-2 bg-muted rounded">
                  <span className="text-success">✓</span> [2024-01-12 09:45:22] Monthly Purchase Milestone: Tier upgrade Gold→Platinum for user priya.sharma@email.com
                </div>
                <div className="p-2 bg-muted rounded">
                  <span className="text-warning">⚠</span> [2024-01-12 08:15:03] Referral Chain Bonus: Condition not met - chain length: 2
                </div>
                <div className="p-2 bg-muted rounded">
                  <span className="text-success">✓</span> [2024-01-11 16:20:45] Referral Chain Bonus: Awarded 250 points to 4 chain members
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RuleEngine;