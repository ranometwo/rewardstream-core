import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Clock } from "lucide-react";

const RuleEngine = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Target className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rule Engine</h1>
          <p className="text-muted-foreground">Configure business rules and logic</p>
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
            The Rule Engine is currently under development. This feature will allow you to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <p>• Create custom business rules</p>
              <p>• Configure point calculations</p>
              <p>• Set conditional logic</p>
            </div>
            <div className="space-y-2">
              <p>• Test rule scenarios</p>
              <p>• Monitor rule performance</p>
              <p>• Version control rules</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RuleEngine;
