import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Filter, Users, Package, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState, useEffect, useCallback, useMemo } from "react";

interface SchemeReportsDashboardProps {
  selectedScheme: string;
}

const SchemeReportsDashboard = ({ selectedScheme }: SchemeReportsDashboardProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Smooth toggle with useCallback to prevent unnecessary re-renders
  const toggleFilters = useCallback(() => {
    setFiltersOpen(prev => !prev);
  }, []);

  const closeFilters = useCallback(() => {
    setFiltersOpen(false);
  }, []);

  // Handle ESC key to close filters
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeFilters();
      }
    };
    
    if (filtersOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [filtersOpen, closeFilters]);
  
  // Memoized mock data to prevent unnecessary re-renders
  const campaignImpact = useMemo(() => ({
    targetUsers: 150,
    usersUplifted: 50,
    upliftPercentage: 33.3,
    avgVolUplift: { before: 2.0, after: 2.1, percentage: 5 },
    totalVolUplift: 50
  }), []);

  const slabWiseData = useMemo(() => [
    { slab: 'Slab A (0-50)', targetUsers: 100, usersUplifted: 20, upliftPercent: 5, avgVolUplift: 0.1, totalVolUplift: 30 },
    { slab: 'Slab B (50-100)', targetUsers: 30, usersUplifted: 15, upliftPercent: 10, avgVolUplift: 0.2, totalVolUplift: 15 },
    { slab: 'Slab C (>100)', targetUsers: 20, usersUplifted: 15, upliftPercent: 18, avgVolUplift: 0.3, totalVolUplift: 5 }
  ], []);

  const productMixBefore = useMemo(() => [
    { name: 'Ever Wash', value: 25, color: '#8B5CF6' },
    { name: 'Calista Premium', value: 20, color: '#06B6D4' },
    { name: 'One Coat', value: 18, color: '#10B981' },
    { name: 'Tech Primer', value: 15, color: '#F59E0B' },
    { name: 'Interior Plus', value: 12, color: '#EF4444' },
    { name: 'Others', value: 10, color: '#6B7280' }
  ], []);

  const productMixAfter = useMemo(() => [
    { name: 'Ever Wash', value: 30, color: '#8B5CF6' },
    { name: 'Calista Premium', value: 22, color: '#06B6D4' },
    { name: 'One Coat', value: 20, color: '#10B981' },
    { name: 'Tech Primer', value: 13, color: '#F59E0B' },
    { name: 'Interior Plus', value: 10, color: '#EF4444' },
    { name: 'Others', value: 5, color: '#6B7280' }
  ], []);

  const slabProgressionData = useMemo(() => [
    { day: 'Pre-Campaign', slabA: 90, slabB: 50, slabC: 120, newUsers: 0 },
    { day: 'Day 1', slabA: 90, slabB: 60, slabC: 135, newUsers: 10 },
    { day: 'Day 2', slabA: 80, slabB: 65, slabC: 140, newUsers: 20 },
    { day: 'Day 3', slabA: 85, slabB: 70, slabC: 150, newUsers: 30 },
    { day: 'Post-Campaign', slabA: 95, slabB: 75, slabC: 165, newUsers: 50 }
  ], []);

  const volumeProgressionData = useMemo(() => [
    { day: 'Pre-Campaign', slabA: 180, slabB: 150, slabC: 200, newUsers: 0 },
    { day: 'Day 1', slabA: 200, slabB: 180, slabC: 250, newUsers: 20 },
    { day: 'Day 2', slabA: 190, slabB: 185, slabC: 260, newUsers: 40 },
    { day: 'Day 3', slabA: 210, slabB: 190, slabC: 280, newUsers: 50 },
    { day: 'Post-Campaign', slabA: 230, slabB: 225, slabC: 320, newUsers: 70 }
  ], []);

  return (
    <div className="relative">
      {/* Backdrop Overlay */}
      {filtersOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={closeFilters}
        />
      )}

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 ease-out",
        filtersOpen ? "mr-80" : "mr-0"
      )}>
        <div className="space-y-3">
          {/* Compact Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Dashboard Analytics</h2>
              <p className="text-sm text-muted-foreground">Performance metrics for {selectedScheme}</p>
            </div>
            <Button 
              variant="outline" 
               size="default"
              onClick={toggleFilters}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Enhanced KPI Metrics - 6 Column Layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="text-center p-3 bg-gradient-secondary rounded-lg">
              <div className="text-lg font-bold text-foreground">{campaignImpact.targetUsers}</div>
              <div className="text-xs font-medium text-muted-foreground">Target Users</div>
              <div className="text-xs text-success">vs 130 last month</div>
            </div>
            <div className="text-center p-3 bg-gradient-secondary rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-lg font-bold text-foreground">{campaignImpact.usersUplifted}</span>
                <Badge className="bg-gradient-success text-success-foreground text-xs">
                  +{campaignImpact.upliftPercentage}%
                </Badge>
              </div>
              <div className="text-xs font-medium text-muted-foreground">Users Uplifted</div>
              <div className="text-xs text-success">+12% vs target</div>
            </div>
            <div className="text-center p-3 bg-gradient-secondary rounded-lg">
              <div className="text-lg font-bold text-foreground">245%</div>
              <div className="text-xs font-medium text-muted-foreground">ROI</div>
              <div className="text-xs text-success">↗ +15% vs Q3</div>
            </div>
            <div className="text-center p-3 bg-gradient-secondary rounded-lg">
              <div className="text-lg font-bold text-foreground">₹125</div>
              <div className="text-xs font-medium text-muted-foreground">Cost per User</div>
              <div className="text-xs text-warning">↘ -8% optimized</div>
            </div>
            <div className="text-center p-3 bg-gradient-secondary rounded-lg">
              <div className="text-lg font-bold text-foreground">₹2.4M</div>
              <div className="text-xs font-medium text-muted-foreground">Revenue Impact</div>
              <div className="text-xs text-success">+18% vs target</div>
            </div>
            <div className="text-center p-3 bg-gradient-secondary rounded-lg">
              <div className="text-lg font-bold text-foreground">15.2%</div>
              <div className="text-xs font-medium text-muted-foreground">Conversion Rate</div>
              <div className="text-xs text-success">+2.1% uplift</div>
            </div>
          </div>

          {/* Additional KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="text-center p-3 bg-gradient-secondary rounded-lg">
              <div className="text-lg font-bold text-foreground">8.7/10</div>
              <div className="text-xs font-medium text-muted-foreground">Engagement Score</div>
              <div className="text-xs text-success">+0.4 vs baseline</div>
            </div>
            <div className="text-center p-3 bg-gradient-secondary rounded-lg">
              <div className="text-lg font-bold text-foreground">3.2 days</div>
              <div className="text-xs font-medium text-muted-foreground">Time to Value</div>
              <div className="text-xs text-success">-1.3 days faster</div>
            </div>
            <div className="text-center p-3 bg-gradient-secondary rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-sm font-bold text-foreground">
                  {campaignImpact.avgVolUplift.before}L→{campaignImpact.avgVolUplift.after}L
                </span>
                <Badge className="bg-gradient-success text-success-foreground text-xs">
                  +{campaignImpact.avgVolUplift.percentage}%
                </Badge>
              </div>
              <div className="text-xs font-medium text-muted-foreground">Avg Vol Uplift</div>
              <div className="text-xs text-success">Above benchmark</div>
            </div>
            <div className="text-center p-3 bg-gradient-secondary rounded-lg">
              <div className="text-lg font-bold text-foreground">{campaignImpact.totalVolUplift}L</div>
              <div className="text-xs font-medium text-muted-foreground">Total Vol Uplift</div>
              <div className="text-xs text-success">+23% vs plan</div>
            </div>
            <div className="text-center p-3 bg-gradient-secondary rounded-lg">
              <div className="text-lg font-bold text-foreground">87%</div>
              <div className="text-xs font-medium text-muted-foreground">Retention Rate</div>
              <div className="text-xs text-success">+5% vs control</div>
            </div>
            <div className="text-center p-3 bg-gradient-secondary rounded-lg">
              <div className="text-lg font-bold text-foreground">42 days</div>
              <div className="text-xs font-medium text-muted-foreground">Avg Cycle Time</div>
              <div className="text-xs text-warning">-3 days vs Q3</div>
            </div>
          </div>

          {/* Compact Slab Wise Upliftment Table */}
          <Card className="border-border shadow-enterprise">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground text-lg">Slab Wise Upliftment</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-sm font-medium text-muted-foreground py-2">Slab Range</th>
                      <th className="text-center text-sm font-medium text-muted-foreground py-2">Target Users</th>
                      <th className="text-center text-sm font-medium text-muted-foreground py-2">Users Uplifted</th>
                      <th className="text-center text-sm font-medium text-muted-foreground py-2">Uplift %</th>
                      <th className="text-center text-sm font-medium text-muted-foreground py-2">Avg Vol Uplift</th>
                      <th className="text-center text-sm font-medium text-muted-foreground py-2">Total Vol Uplift</th>
                      <th className="text-center text-sm font-medium text-muted-foreground py-2">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slabWiseData.map((slab, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-gradient-secondary/50 transition-colors">
                        <td className="py-3">
                          <div className="font-medium text-foreground text-sm">{slab.slab}</div>
                        </td>
                        <td className="text-center py-3">
                          <div className="text-sm font-bold text-foreground">{slab.targetUsers}</div>
                        </td>
                        <td className="text-center py-3">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-sm font-bold text-foreground">{slab.usersUplifted}</span>
                          </div>
                        </td>
                        <td className="text-center py-3">
                          <Badge className="bg-gradient-success text-success-foreground text-xs">
                            +{slab.upliftPercent}%
                          </Badge>
                        </td>
                        <td className="text-center py-3">
                          <div className="text-sm font-bold text-foreground">+{slab.avgVolUplift}L</div>
                        </td>
                        <td className="text-center py-3">
                          <div className="text-sm font-bold text-foreground">{slab.totalVolUplift}L</div>
                        </td>
                        <td className="text-center py-3">
                          <div className="text-success text-sm">
                            {index === 0 ? '↗ +5%' : index === 1 ? '↗ +8%' : '↗ +12%'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Compact Product Mix Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card className="border-border shadow-enterprise">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-base">Product Mix - Before</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="w-full h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productMixBefore}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={300}
                      >
                        {productMixBefore.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-enterprise">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-base">Product Mix - After</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="w-full h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productMixAfter}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={300}
                      >
                        {productMixAfter.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compact Slab Change Charts - Vertical Stacked */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card className="border-border shadow-enterprise">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-base">Slab Change - User Uplift Progression</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={slabProgressionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="slabA" stackId="a" fill="#8B5CF6" name="Slab A" animationDuration={300} />
                      <Bar dataKey="slabB" stackId="a" fill="#06B6D4" name="Slab B" animationDuration={300} />
                      <Bar dataKey="slabC" stackId="a" fill="#10B981" name="Slab C" animationDuration={300} />
                      <Bar dataKey="newUsers" stackId="b" fill="#F59E0B" name="New Users" animationDuration={300} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-enterprise">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-base">Slab Change - Volume Uplift Progression</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={volumeProgressionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="slabA" stackId="a" fill="#8B5CF6" name="Slab A" animationDuration={300} />
                      <Bar dataKey="slabB" stackId="a" fill="#06B6D4" name="Slab B" animationDuration={300} />
                      <Bar dataKey="slabC" stackId="a" fill="#10B981" name="Slab C" animationDuration={300} />
                      <Bar dataKey="newUsers" stackId="b" fill="#F59E0B" name="New Users" animationDuration={300} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compact Net Business Impact */}
          <Card className="border-border shadow-enterprise">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground text-base">Net Business Impact (Existing + New - Churned)</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="text-center p-2 bg-gradient-secondary rounded-lg">
                  <div className="text-lg font-bold text-foreground">{campaignImpact.targetUsers}</div>
                  <div className="text-xs font-medium text-muted-foreground">Net Target Users</div>
                  <div className="text-xs text-success">+15 new acquisitions</div>
                </div>
                <div className="text-center p-2 bg-gradient-secondary rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-lg font-bold text-foreground">{campaignImpact.usersUplifted}</span>
                    <Badge className="bg-gradient-success text-success-foreground text-xs">
                      +{campaignImpact.upliftPercentage}%
                    </Badge>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">Net Users Uplifted</div>
                  <div className="text-xs text-success">-3 churned, +53 total</div>
                </div>
                <div className="text-center p-2 bg-gradient-secondary rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-sm font-bold text-foreground">
                      {campaignImpact.avgVolUplift.before}L→{campaignImpact.avgVolUplift.after}L
                    </span>
                    <Badge className="bg-gradient-success text-success-foreground text-xs">
                      +{campaignImpact.avgVolUplift.percentage}%
                    </Badge>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">Net Avg Vol Uplift</div>
                  <div className="text-xs text-success">Consistent growth</div>
                </div>
                <div className="text-center p-2 bg-gradient-secondary rounded-lg">
                  <div className="text-lg font-bold text-foreground">{campaignImpact.totalVolUplift}L</div>
                  <div className="text-xs font-medium text-muted-foreground">Net Total Vol Uplift</div>
                  <div className="text-xs text-success">₹2.1M incremental</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters Sidebar - Slide Out Panel */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-80 bg-card border-l border-border z-50 transform transition-transform duration-300 ease-out overflow-auto",
        filtersOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </h3>
            <Button
              variant="ghost"
               size="default"
              onClick={closeFilters}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Date Range Filters */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Date Range</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Start Date</label>
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
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">End Date</label>
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
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Geographic Filters */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Geographic Filters</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Region</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north">North India</SelectItem>
                    <SelectItem value="south">South India</SelectItem>
                    <SelectItem value="east">East India</SelectItem>
                    <SelectItem value="west">West India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">State</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">City</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Product Classification Filters */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <Package className="w-4 h-4" />
              Product Classification
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interior">Interior Paints</SelectItem>
                    <SelectItem value="exterior">Exterior Paints</SelectItem>
                    <SelectItem value="wood">Wood Finishes</SelectItem>
                    <SelectItem value="primer">Primers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Brand</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="royale">Royale</SelectItem>
                    <SelectItem value="berger">Berger Paints</SelectItem>
                    <SelectItem value="nerolac">Nerolac</SelectItem>
                    <SelectItem value="dulux">Dulux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Price Range</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">Premium (₹500+)</SelectItem>
                    <SelectItem value="mid">Mid Range (₹200-₹500)</SelectItem>
                    <SelectItem value="economy">Economy (&lt;₹200)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="pt-4 border-t border-border space-y-3">
            <Button variant="outline" size="default" className="w-full">
              Clear All Filters
            </Button>
            <Button size="default" className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeReportsDashboard;