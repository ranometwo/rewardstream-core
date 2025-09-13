import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock } from "lucide-react";

const Analytics: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Advanced analytics and insights</p>
          </div>
        </div>

        <Card className="border-border shadow-enterprise bg-gradient-secondary">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl text-foreground">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              The Advanced Analytics system is currently under development. This feature will provide:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p>• Deep user behavior analysis</p>
                <p>• Predictive modeling</p>
                <p>• Custom report builder</p>
              </div>
              <div className="space-y-2">
                <p>• Real-time data visualization</p>
                <p>• Performance benchmarking</p>
                <p>• Automated insights</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;