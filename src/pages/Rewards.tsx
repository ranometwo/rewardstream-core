import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Clock } from "lucide-react";

const Rewards: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Gift className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Rewards</h1>
            <p className="text-muted-foreground">Manage reward catalog and redemptions</p>
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
              The Rewards management system is currently under development. This feature will allow you to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p>• Create and manage reward catalogs</p>
                <p>• Set point redemption values</p>
                <p>• Track reward inventory</p>
              </div>
              <div className="space-y-2">
                <p>• Monitor redemption history</p>
                <p>• Configure reward categories</p>
                <p>• Analyze reward performance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Rewards;