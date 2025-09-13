import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Clock } from "lucide-react";

const SchemeManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Zap className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Scheme Management</h1>
          <p className="text-muted-foreground">Create and manage loyalty schemes</p>
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
            The Scheme Management system is currently under development. This feature will allow you to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <p>• Create custom loyalty schemes</p>
              <p>• Configure point structures</p>
              <p>• Set eligibility criteria</p>
            </div>
            <div className="space-y-2">
              <p>• Monitor scheme performance</p>
              <p>• Manage participant enrollment</p>
              <p>• Track scheme analytics</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchemeManagement;