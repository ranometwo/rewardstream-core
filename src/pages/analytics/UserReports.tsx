import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Clock, Target, Filter } from "lucide-react";

const UserReports: React.FC = () => {
  const userStats = [
    { label: "Total Active Users", value: "2,485", change: "+12.3%" },
    { label: "High-Value Users", value: "342", change: "+8.7%" },
    { label: "Avg. Engagement Score", value: "78%", change: "+5.2%" },
    { label: "Churn Risk Users", value: "89", change: "-15.4%" },
  ];

  const userSegments = [
    { name: "Champions", count: 145, percentage: 12, description: "High value, high engagement", color: "bg-gradient-success" },
    { name: "Loyal Customers", count: 234, percentage: 19, description: "Regular purchasers", color: "bg-gradient-primary" },
    { name: "Potential Loyalists", count: 456, percentage: 37, description: "Recent customers with potential", color: "bg-gradient-secondary" },
    { name: "At Risk", count: 89, percentage: 7, description: "Declining engagement", color: "bg-warning" },
    { name: "New Customers", count: 312, percentage: 25, description: "Recently onboarded", color: "bg-muted" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Reports</h1>
            <p className="text-muted-foreground">Individual user analytics and behavioral insights</p>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {userStats.map((stat, index) => (
            <Card key={index} className="border-border shadow-enterprise">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <Badge 
                  className={`mt-1 text-xs ${
                    stat.change.startsWith('+') 
                      ? 'bg-gradient-success text-success-foreground' 
                      : 'bg-destructive text-destructive-foreground'
                  }`}
                >
                  {stat.change}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Segmentation */}
        <Card className="border-border shadow-enterprise">
          <CardHeader>
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <Target className="w-5 h-5" />
              User Segmentation Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userSegments.map((segment, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gradient-secondary rounded-lg">
                  <div className={`h-12 w-12 rounded-lg ${segment.color} flex items-center justify-center`}>
                    <span className="text-white font-bold">{segment.percentage}%</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{segment.name}</div>
                    <div className="text-sm text-muted-foreground">{segment.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">{segment.count}</div>
                    <div className="text-xs text-muted-foreground">users</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border shadow-enterprise">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center mb-3">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg text-foreground">User Journey Analytics</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4 text-sm">
                Detailed analysis of individual user journeys, touchpoints, and conversion paths.
              </p>
              <Badge variant="outline" className="mb-4">Coming Soon</Badge>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>• Customer lifecycle mapping</p>
                <p>• Touchpoint analysis</p>
                <p>• Conversion funnel insights</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-enterprise">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center mb-3">
                <Clock className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg text-foreground">Behavioral Insights</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4 text-sm">
                Advanced behavioral analytics with predictive modeling and personalization recommendations.
              </p>
              <Badge variant="outline" className="mb-4">Coming Soon</Badge>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>• Purchase pattern analysis</p>
                <p>• Predictive churn modeling</p>
                <p>• Personalization insights</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UserReports;