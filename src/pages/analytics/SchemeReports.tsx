import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar } from "lucide-react";
import SchemeReportsDashboard from "@/components/SchemeReportsDashboard";

const SchemeReports: React.FC = () => {
  const [selectedScheme, setSelectedScheme] = useState<string>("q1-2024-volume-booster");

  const schemes = [
    { value: "q1-2024-volume-booster", label: "Q1 2024 Volume Booster Scheme", status: "Active", users: 2450 },
    { value: "premium-paint-loyalty", label: "Premium Paint Loyalty Program", status: "Active", users: 1230 },
    { value: "dealer-incentive-2024", label: "Dealer Incentive Scheme 2024", status: "Active", users: 890 },
    { value: "regional-growth-campaign", label: "Regional Growth Campaign", status: "Active", users: 1560 },
    { value: "seasonal-promotion-winter", label: "Seasonal Promotion - Winter", status: "Completed", users: 780 },
    { value: "new-customer-onboarding", label: "New Customer Onboarding", status: "Active", users: 2100 },
    { value: "tier-upgrade-incentive", label: "Tier Upgrade Incentive Program", status: "Draft", users: 0 },
    { value: "bulk-purchase-rewards", label: "Bulk Purchase Rewards", status: "Active", users: 650 },
    { value: "referral-bonus-scheme", label: "Referral Bonus Scheme", status: "Active", users: 340 },
    { value: "anniversary-celebration", label: "Anniversary Celebration Campaign", status: "Completed", users: 1890 },
    { value: "eco-friendly-initiative", label: "Eco-Friendly Product Initiative", status: "Active", users: 420 },
    { value: "mobile-app-engagement", label: "Mobile App Engagement Boost", status: "Active", users: 1100 }
  ];

  const selectedSchemeData = schemes.find(s => s.value === selectedScheme);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-gradient-success text-success-foreground";
      case "Completed": return "bg-muted text-muted-foreground";
      case "Draft": return "bg-warning text-warning-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Scheme Reports</h1>
            <p className="text-muted-foreground">Performance analytics for slab-based loyalty schemes</p>
          </div>
        </div>

        {/* Scheme Selector */}
        <Card className="border-border shadow-enterprise">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Select Scheme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Select value={selectedScheme} onValueChange={setSelectedScheme}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a scheme to analyze" />
                  </SelectTrigger>
                  <SelectContent>
                    {schemes.map((scheme) => (
                      <SelectItem key={scheme.value} value={scheme.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{scheme.label}</span>
                          <div className="flex items-center gap-2 ml-4">
                            <Badge className={`text-xs ${getStatusColor(scheme.status)}`}>
                              {scheme.status}
                            </Badge>
                            {scheme.users > 0 && (
                              <span className="text-xs text-muted-foreground">
                                {scheme.users.toLocaleString()} users
                              </span>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedSchemeData && (
                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(selectedSchemeData.status)}`}>
                    {selectedSchemeData.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedSchemeData.users.toLocaleString()} participants
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reports Dashboard */}
        <SchemeReportsDashboard selectedScheme={selectedScheme} />
      </div>
    </Layout>
  );
};

export default SchemeReports;