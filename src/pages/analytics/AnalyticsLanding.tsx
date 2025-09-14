import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Target, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AnalyticsLanding: React.FC = () => {
  const analyticsCards = [
    {
      title: "Scheme Reports",
      description: "Comprehensive reporting for all slab-based loyalty schemes",
      icon: BarChart3,
      path: "/analytics/schemes",
      stats: "12 Active Schemes",
      color: "bg-gradient-primary",
    },
    {
      title: "User Reports",
      description: "Individual user analytics and behavioral insights", 
      icon: Users,
      path: "/analytics/users",
      stats: "2.5K Active Users",
      color: "bg-gradient-secondary",
    },
    {
      title: "Advanced Analytics",
      description: "Predictive modeling and deep insights",
      icon: Target,
      path: "/analytics/advanced", 
      stats: "Coming Soon",
      color: "bg-gradient-success",
    },
  ];

  const quickStats = [
    { label: "Total Revenue Impact", value: "₹2.4M", change: "+12.5%" },
    { label: "Active Campaigns", value: "8", change: "+2" },
    { label: "User Engagement", value: "78%", change: "+5.2%" },
    { label: "Volume Uplift", value: "450L", change: "+18%" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics Hub</h1>
            <p className="text-muted-foreground">Comprehensive insights and reporting across all loyalty programs</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="border-border shadow-enterprise">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <Badge className="mt-1 bg-gradient-success text-success-foreground text-xs">
                  {stat.change}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {analyticsCards.map((card, index) => (
            <Card key={index} className="border-border shadow-enterprise hover:shadow-elevated transition-all duration-200 group">
              <CardHeader className="pb-4">
                <div className={`h-12 w-12 rounded-lg ${card.color} flex items-center justify-center mb-4`}>
                  <card.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl text-foreground">{card.title}</CardTitle>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">{card.stats}</Badge>
                  <Link to={card.path}>
                    <Button 
                      variant="ghost" 
                      size="default"
                      className="group-hover:bg-accent group-hover:text-accent-foreground"
                    >
                      View Reports
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="border-border shadow-enterprise">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Recent Analytics Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: "Q1 2024 Volume Booster Report generated", time: "2 hours ago", status: "success" },
                { action: "Premium Paint Loyalty Program analytics updated", time: "4 hours ago", status: "info" },
                { action: "User segmentation analysis completed", time: "1 day ago", status: "success" },
                { action: "Regional Growth Campaign metrics refreshed", time: "2 days ago", status: "info" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge 
                    variant={activity.status === 'success' ? 'default' : 'outline'} 
                    className="text-xs"
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AnalyticsLanding;