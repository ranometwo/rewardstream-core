import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Filter, TrendingUp, TrendingDown, Users, Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";

const ReportingDashboard = () => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  
  // Mock data for the dashboard
  const campaignImpact = {
    targetUsers: 150,
    usersUplifted: 50,
    upliftPercentage: 33.3,
    avgVolUplift: { before: 2.0, after: 2.1, percentage: 5 },
    totalVolUplift: 50
  };

  const slabWiseData = [
    { slab: 'Slab A (0-50)', targetUsers: 100, usersUplifted: 20, upliftPercent: 5, avgVolUplift: 0.1, totalVolUplift: 30 },
    { slab: 'Slab B (50-100)', targetUsers: 30, usersUplifted: 15, upliftPercent: 10, avgVolUplift: 0.2, totalVolUplift: 15 },
    { slab: 'Slab C (>100)', targetUsers: 20, usersUplifted: 15, upliftPercent: 18, avgVolUplift: 0.3, totalVolUplift: 5 }
  ];

  const productMixBefore = [
    { name: 'Ever Wash', value: 25, color: '#8B5CF6' },
    { name: 'Calista Premium', value: 20, color: '#06B6D4' },
    { name: 'One Coat', value: 18, color: '#10B981' },
    { name: 'Tech Primer', value: 15, color: '#F59E0B' },
    { name: 'Interior Plus', value: 12, color: '#EF4444' },
    { name: 'Others', value: 10, color: '#6B7280' }
  ];

  const productMixAfter = [
    { name: 'Ever Wash', value: 30, color: '#8B5CF6' },
    { name: 'Calista Premium', value: 22, color: '#06B6D4' },
    { name: 'One Coat', value: 20, color: '#10B981' },
    { name: 'Tech Primer', value: 13, color: '#F59E0B' },
    { name: 'Interior Plus', value: 10, color: '#EF4444' },
    { name: 'Others', value: 5, color: '#6B7280' }
  ];

  const slabProgressionData = [
    { day: 'Pre-Campaign', slabA: 90, slabB: 50, slabC: 60, newUsers: 0, churn: 0 },
    { day: 'Day 1', slabA: 100, slabB: 60, slabC: 70, newUsers: 10, churn: 2 },
    { day: 'Day 2', slabA: 80, slabB: 65, slabC: 75, newUsers: 20, churn: 4 },
    { day: 'Day 3', slabA: 85, slabB: 70, slabC: 80, newUsers: 25, churn: 3 },
    { day: 'Post-Campaign', slabA: 95, slabB: 75, slabC: 85, newUsers: 35, churn: 5 }
  ];

  const volumeProgressionData = [
    { day: 'Pre-Campaign', slabA: 180, slabB: 150, slabC: 200, newUsers: 0 },
    { day: 'Day 1', slabA: 200, slabB: 180, slabC: 250, newUsers: 20 },
    { day: 'Day 2', slabA: 190, slabB: 185, slabC: 260, newUsers: 40 },
    { day: 'Day 3', slabA: 210, slabB: 190, slabC: 280, newUsers: 50 },
    { day: 'Post-Campaign', slabA: 230, slabB: 225, slabC: 320, newUsers: 70 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Slab Based Scheme Dashboard</h2>
          <p className="text-muted-foreground">Performance analytics for quarterly slab-based loyalty schemes</p>
        </div>
        <Button className="bg-gradient-primary text-primary-foreground shadow-glass">
          <Filter className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters Section */}
      <Card className="border-border shadow-enterprise">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Geographic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Zone</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Region</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="haryana">Haryana</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="rajasthan">Rajasthan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Territory</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select territory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hisar">Hisar</SelectItem>
                  <SelectItem value="noida">Noida</SelectItem>
                  <SelectItem value="lucknow">Lucknow</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Pincode</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select pincode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="110001">110001</SelectItem>
                  <SelectItem value="400001">400001</SelectItem>
                  <SelectItem value="560001">560001</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Classification Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Product Group</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select product group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="topcoat">Topcoat</SelectItem>
                  <SelectItem value="primer">Primer</SelectItem>
                  <SelectItem value="putty">Putty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interior">Interior</SelectItem>
                  <SelectItem value="exterior">Exterior</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sub-Brand</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calista">Calista</SelectItem>
                  <SelectItem value="one">One</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Impact */}
      <Card className="border-border shadow-enterprise">
        <CardHeader>
          <CardTitle className="text-foreground">Campaign Impact (All Slabs Inclusive)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-foreground">{campaignImpact.targetUsers}</div>
              <div className="text-sm text-muted-foreground">Target Users</div>
              <div className="text-xs text-muted-foreground">(baseline across slabs)</div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-foreground">{campaignImpact.usersUplifted}</span>
                <Badge className="bg-gradient-success text-success-foreground">
                  +{campaignImpact.upliftPercentage}%
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">Users Uplifted</div>
              <div className="text-xs text-muted-foreground">(across slabs for target users)</div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {campaignImpact.avgVolUplift.before}L → {campaignImpact.avgVolUplift.after}L
                </span>
                <Badge className="bg-gradient-success text-success-foreground">
                  +{campaignImpact.avgVolUplift.percentage}%
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">Avg Vol Uplift per User</div>
              <div className="text-xs text-muted-foreground">(pre and post window)</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-foreground">{campaignImpact.totalVolUplift}L</div>
              <div className="text-sm text-muted-foreground">Total Vol Uplift</div>
              <div className="text-xs text-muted-foreground">(for target users)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slab Wise Upliftment */}
      <Card className="border-border shadow-enterprise">
        <CardHeader>
          <CardTitle className="text-foreground">Slab Wise Upliftment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {slabWiseData.map((slab, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 border border-border rounded-lg bg-gradient-secondary">
                <div className="text-center space-y-2">
                  <div className="text-lg font-bold text-foreground">{slab.targetUsers}</div>
                  <div className="text-sm text-muted-foreground">Target Users</div>
                  <div className="text-xs font-medium text-primary">{slab.slab}</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg font-bold text-foreground">{slab.usersUplifted}</span>
                    <Badge className="bg-gradient-success text-success-foreground">
                      {slab.upliftPercent}%
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">Users Uplifted</div>
                  <div className="text-xs text-muted-foreground">(moved to higher slab)</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-lg font-bold text-foreground">+{slab.avgVolUplift}L</div>
                  <div className="text-sm text-muted-foreground">Avg Vol Uplift</div>
                  <div className="text-xs text-muted-foreground">(per user)</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-lg font-bold text-foreground">{slab.totalVolUplift}L</div>
                  <div className="text-sm text-muted-foreground">Total Vol Uplift</div>
                  <div className="text-xs text-muted-foreground">(slab total)</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Mix Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border shadow-enterprise">
          <CardHeader>
            <CardTitle className="text-foreground">Product Mix - Before Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productMixBefore}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {productMixBefore.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border shadow-enterprise">
          <CardHeader>
            <CardTitle className="text-foreground">Product Mix - After Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productMixAfter}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {productMixAfter.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Slab Change Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border shadow-enterprise">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              User Uplift Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={slabProgressionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Legend />
                <Bar dataKey="slabA" stackId="a" fill="#8B5CF6" name="Slab A (0-50)" />
                <Bar dataKey="slabB" stackId="a" fill="#06B6D4" name="Slab B (50-100)" />
                <Bar dataKey="slabC" stackId="a" fill="#10B981" name="Slab C (>100)" />
                <Bar dataKey="newUsers" stackId="a" fill="#F59E0B" name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border shadow-enterprise">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Package className="w-4 h-4" />
              Volume Uplift Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={volumeProgressionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Legend />
                <Bar dataKey="slabA" stackId="a" fill="#8B5CF6" name="Slab A Volume" />
                <Bar dataKey="slabB" stackId="a" fill="#06B6D4" name="Slab B Volume" />
                <Bar dataKey="slabC" stackId="a" fill="#10B981" name="Slab C Volume" />
                <Bar dataKey="newUsers" stackId="a" fill="#F59E0B" name="New User Volume" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Net Business Impact */}
      <Card className="border-border shadow-enterprise">
        <CardHeader>
          <CardTitle className="text-foreground">Net Business Impact (Existing + New - Churned)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-foreground">150</div>
              <div className="text-sm text-muted-foreground">Net Target Users</div>
              <div className="text-xs text-muted-foreground">(baseline across slabs)</div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-foreground">50</span>
                <Badge className="bg-gradient-success text-success-foreground">
                  +30%
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">Net Users Uplifted</div>
              <div className="text-xs text-muted-foreground">(across slabs for net users)</div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-foreground">2.0L → 2.1L</span>
                <Badge className="bg-gradient-success text-success-foreground">
                  +5%
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">Net Avg Vol Uplift</div>
              <div className="text-xs text-muted-foreground">(per net user)</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-foreground">50L</div>
              <div className="text-sm text-muted-foreground">Net Total Vol Uplift</div>
              <div className="text-xs text-muted-foreground">(for net users)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingDashboard;