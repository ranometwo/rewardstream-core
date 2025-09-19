import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, AlertTriangle, Shield, Target } from "lucide-react";
import type { Campaign } from "../AdvancedBuilder";

interface BudgetManagerProps {
  campaign: Campaign;
  updateCampaign: (updates: Partial<Campaign>) => void;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({ campaign, updateCampaign }) => {
  const updateBudgets = (budgetUpdates: any) => {
    updateCampaign({
      budgets: { ...campaign.budgets, ...budgetUpdates }
    });
  };

  const formatNumber = (num: number | null) => {
    if (num === null) return "Unlimited";
    return new Intl.NumberFormat("en-IN").format(num);
  };

  // Mock current usage data
  const currentUsage = {
    totalPointsUsed: 45000,
    totalCouponsIssued: 1250,
    dailyPointsUsed: 2500,
    monthlyPointsUsed: 35000
  };

  const getUsagePercentage = (used: number, cap: number | null) => {
    if (cap === null) return 0;
    return Math.min((used / cap) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <Card className="shadow-enterprise">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Budget Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {/* Points Usage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Points Budget</h4>
                <Badge variant="outline">
                  {formatNumber(currentUsage.totalPointsUsed)} / {formatNumber(campaign.budgets.totalPointsCap)}
                </Badge>
              </div>
              
              <Progress 
                value={getUsagePercentage(currentUsage.totalPointsUsed, campaign.budgets.totalPointsCap)}
                className="h-2"
              />
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Used: ₹{formatNumber(currentUsage.totalPointsUsed)}</span>
                <span>
                  {campaign.budgets.totalPointsCap 
                    ? `${getUsagePercentage(currentUsage.totalPointsUsed, campaign.budgets.totalPointsCap).toFixed(1)}%`
                    : "No Limit"
                  }
                </span>
              </div>
            </div>

            {/* Coupon Usage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Coupon Budget</h4>
                <Badge variant="outline">
                  {formatNumber(currentUsage.totalCouponsIssued)} / {formatNumber(campaign.budgets.totalCouponCap)}
                </Badge>
              </div>
              
              <Progress 
                value={getUsagePercentage(currentUsage.totalCouponsIssued, campaign.budgets.totalCouponCap)}
                className="h-2"
              />
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Issued: {formatNumber(currentUsage.totalCouponsIssued)}</span>
                <span>
                  {campaign.budgets.totalCouponCap 
                    ? `${getUsagePercentage(currentUsage.totalCouponsIssued, campaign.budgets.totalCouponCap).toFixed(1)}%`
                    : "No Limit"
                  }
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign-Level Caps */}
      <Card className="shadow-enterprise">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Campaign-Level Caps</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Points Cap */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Total Points Budget</Label>
              <Switch
                checked={campaign.budgets.totalPointsCap !== null}
                onCheckedChange={(enabled) => updateBudgets({
                  totalPointsCap: enabled ? 100000 : null
                })}
              />
            </div>
            
            {campaign.budgets.totalPointsCap !== null && (
              <div className="space-y-2">
                <Input
                  type="number"
                  value={campaign.budgets.totalPointsCap || ""}
                  onChange={(e) => updateBudgets({
                    totalPointsCap: parseInt(e.target.value) || 0
                  })}
                  placeholder="100000"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum points that can be awarded across all rules
                </p>
              </div>
            )}
          </div>

          {/* Total Coupon Cap */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Total Coupon Budget</Label>
              <Switch
                checked={campaign.budgets.totalCouponCap !== null}
                onCheckedChange={(enabled) => updateBudgets({
                  totalCouponCap: enabled ? 5000 : null
                })}
              />
            </div>
            
            {campaign.budgets.totalCouponCap !== null && (
              <div className="space-y-2">
                <Input
                  type="number"
                  value={campaign.budgets.totalCouponCap || ""}
                  onChange={(e) => updateBudgets({
                    totalCouponCap: parseInt(e.target.value) || 0
                  })}
                  placeholder="5000"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum coupons that can be issued across all rules
                </p>
              </div>
            )}
          </div>

          {/* Threshold Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Soft Cap Threshold (%)</Label>
              <Input
                type="number"
                value={campaign.budgets.softCapThreshold}
                onChange={(e) => updateBudgets({
                  softCapThreshold: parseInt(e.target.value) || 80
                })}
                min={0}
                max={100}
              />
              <p className="text-xs text-muted-foreground">
                Warn when usage exceeds this percentage
              </p>
            </div>

            <div className="space-y-2">
              <Label>Hard Cap Threshold (%)</Label>
              <Input
                type="number"
                value={campaign.budgets.hardCapThreshold}
                onChange={(e) => updateBudgets({
                  hardCapThreshold: parseInt(e.target.value) || 95
                })}
                min={0}
                max={100}
              />
              <p className="text-xs text-muted-foreground">
                Block execution when usage exceeds this percentage
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Per-User Caps */}
      <Card className="shadow-enterprise">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Per-User Limits</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Daily Cap */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Daily Points Cap per User</Label>
              <Switch
                checked={campaign.budgets.perUserDailyCap !== null}
                onCheckedChange={(enabled) => updateBudgets({
                  perUserDailyCap: enabled ? 1000 : null
                })}
              />
            </div>
            
            {campaign.budgets.perUserDailyCap !== null && (
              <div className="space-y-2">
                <Input
                  type="number"
                  value={campaign.budgets.perUserDailyCap || ""}
                  onChange={(e) => updateBudgets({
                    perUserDailyCap: parseInt(e.target.value) || 0
                  })}
                  placeholder="1000"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum points a single user can earn per day
                </p>
              </div>
            )}
          </div>

          {/* Monthly Cap */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Monthly Points Cap per User</Label>
              <Switch
                checked={campaign.budgets.perUserMonthlyCap !== null}
                onCheckedChange={(enabled) => updateBudgets({
                  perUserMonthlyCap: enabled ? 25000 : null
                })}
              />
            </div>
            
            {campaign.budgets.perUserMonthlyCap !== null && (
              <div className="space-y-2">
                <Input
                  type="number"
                  value={campaign.budgets.perUserMonthlyCap || ""}
                  onChange={(e) => updateBudgets({
                    perUserMonthlyCap: parseInt(e.target.value) || 0
                  })}
                  placeholder="25000"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum points a single user can earn per month
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {(getUsagePercentage(currentUsage.totalPointsUsed, campaign.budgets.totalPointsCap) > campaign.budgets.softCapThreshold ||
        getUsagePercentage(currentUsage.totalCouponsIssued, campaign.budgets.totalCouponCap) > campaign.budgets.softCapThreshold) && (
        <Card className="border-warning/20 bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              <span>Budget Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getUsagePercentage(currentUsage.totalPointsUsed, campaign.budgets.totalPointsCap) > campaign.budgets.softCapThreshold && (
                <div className="text-sm text-warning-foreground">
                  • Points usage has exceeded {campaign.budgets.softCapThreshold}% of the budget
                </div>
              )}
              {getUsagePercentage(currentUsage.totalCouponsIssued, campaign.budgets.totalCouponCap) > campaign.budgets.softCapThreshold && (
                <div className="text-sm text-warning-foreground">
                  • Coupon issuance has exceeded {campaign.budgets.softCapThreshold}% of the budget
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetManager;