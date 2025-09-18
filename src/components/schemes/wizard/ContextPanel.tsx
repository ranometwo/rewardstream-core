import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, DollarSign, Package, TrendingUp, AlertCircle, CheckCircle, Play } from "lucide-react";
import { SchemeConfig } from "../SchemeWizard";

interface ContextPanelProps {
  config: SchemeConfig;
  currentStep: number;
}

const ContextPanel: React.FC<ContextPanelProps> = ({ config, currentStep }) => {
  const getEstimatedUsers = () => {
    let base = 15000;
    const filters = config.audienceFilters;
    
    if (filters.zones.length > 0) {
      base = base * (filters.zones.length / 4);
    }
    if (filters.regions.length > 0) {
      base = base * (filters.regions.length / 10);
    }
    if (filters.contractorTier.length > 0) {
      base = base * (filters.contractorTier.length / 4);
    }
    
    return Math.round(base);
  };

  const getEstimatedCost = () => {
    const users = getEstimatedUsers();
    let avgReward = 2500;
    let qualificationRate = 0.3;

    if (config.type === "Top Performers") {
      qualificationRate = (config.rewardLogic.maxWinners || 100) / users;
      avgReward = 5000;
    } else if (config.type === "Product Category + Slab") {
      qualificationRate = 0.4;
      avgReward = 3200;
    } else if (config.type === "Bundles") {
      qualificationRate = 0.25;
      avgReward = 1800;
    }

    return Math.round(users * qualificationRate * avgReward);
  };

  const getTopProducts = () => {
    if (!config.productScope.enabled) return ["All Products"];
    
    const products = [
      ...config.productScope.selectedCategories,
      ...config.productScope.selectedSKUs.slice(0, 3)
    ];
    
    return products.length > 0 ? products : ["No products selected"];
  };

  const getValidationStatus = () => {
    const issues = [];
    
    if (!config.name.trim()) issues.push("Scheme name required");
    if (!config.startDate || !config.endDate) issues.push("Date range required");
    
    if (config.type === "Top Performers") {
      if (!config.rewardLogic.maxWinners) issues.push("Max winners required");
      if (!config.rewardLogic.multiplier) issues.push("Multiplier required");
    }
    
    if (config.type === "Product Category + Slab") {
      if (!config.rewardLogic.slabs?.length) issues.push("Slabs required");
    }
    
    if (config.type === "Bundles") {
      if (!config.rewardLogic.bundles?.length) issues.push("Bundles required");
    }
    
    return issues;
  };

  const estimatedUsers = getEstimatedUsers();
  const estimatedCost = getEstimatedCost();
  const topProducts = getTopProducts();
  const validationIssues = getValidationStatus();

  return (
    <div className="space-y-4 sticky top-6">
      {/* Live Impact */}
      <Card className="border-border shadow-enterprise">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Live Impact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Est. Eligible Users</span>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">{estimatedUsers.toLocaleString()}</p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Est. Cost</span>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">₹{Math.round(estimatedCost / 100000)}L</p>
            <p className="text-xs text-muted-foreground">Based on historical patterns</p>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Status */}
      <Card className="border-border shadow-enterprise">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Configuration Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Completion</span>
              <span className="text-sm font-medium">{Math.round((currentStep / 6) * 100)}%</span>
            </div>
            <Progress value={(currentStep / 6) * 100} className="h-2" />
          </div>
          
          {validationIssues.length > 0 ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-warning-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Issues ({validationIssues.length})
              </p>
              {validationIssues.map((issue, index) => (
                <p key={index} className="text-xs text-muted-foreground">• {issue}</p>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-success-foreground">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Configuration Valid</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Preview */}
      <Card className="border-border shadow-enterprise">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            Preview Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Geographic Scope</p>
            {Object.values(config.audienceFilters).every(arr => arr.length === 0) ? (
              <Badge variant="outline" className="text-xs">All India</Badge>
            ) : (
              <div className="space-y-1">
                {config.audienceFilters.zones.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {config.audienceFilters.zones.slice(0, 2).map(zone => (
                      <Badge key={zone} variant="secondary" className="text-xs">{zone}</Badge>
                    ))}
                    {config.audienceFilters.zones.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{config.audienceFilters.zones.length - 2} more
                      </Badge>
                    )}
                  </div>
                )}
                {config.audienceFilters.regions.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {config.audienceFilters.regions.slice(0, 2).map(region => (
                      <Badge key={region} variant="secondary" className="text-xs">{region}</Badge>
                    ))}
                    {config.audienceFilters.regions.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{config.audienceFilters.regions.length - 2} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Product Scope</p>
            <div className="space-y-1">
              {topProducts.slice(0, 3).map((product, index) => (
                <p key={index} className="text-xs text-foreground">• {product}</p>
              ))}
              {topProducts.length > 3 && (
                <p className="text-xs text-muted-foreground">• +{topProducts.length - 3} more items</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick QA */}
      <Card className="border-border shadow-enterprise">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Play className="h-4 w-4" />
            Quick QA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Test your configuration with sample contractors
          </p>
          <Button variant="outline" size="default" className="w-full" disabled={validationIssues.length > 0}>
            <Play className="h-4 w-4 mr-2" />
            Run 5-User Test
          </Button>
          {validationIssues.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Complete configuration to enable testing
            </p>
          )}
        </CardContent>
      </Card>

      {/* Policy Reminder */}
      <Card className="border-border shadow-enterprise bg-gradient-secondary">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Policy & Guardrails</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>• Rewards credit at end of scheme</p>
            <p>• No manual overrides after publication</p>
            <p>• Locked after publish - clone to modify</p>
            <p>• Returns & cancellations netted automatically</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContextPanel;