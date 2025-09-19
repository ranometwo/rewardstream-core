import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Globe, Clock, Calendar, Zap } from "lucide-react";
import type { Campaign } from "../AdvancedBuilder";

interface CampaignSettingsProps {
  campaign: Campaign;
  updateCampaign: (updates: Partial<Campaign>) => void;
}

const CampaignSettings: React.FC<CampaignSettingsProps> = ({ campaign, updateCampaign }) => {
  const conflictPolicies = [
    {
      value: "allow_all",
      label: "Allow All",
      description: "Apply every matching rule's effects"
    },
    {
      value: "first_match",
      label: "First Match",
      description: "Stop after the first matching rule (order matters)"
    },
    {
      value: "highest_payout",
      label: "Highest Payout Wins",
      description: "Select the rule with the greatest points value"
    }
  ];

  const timezones = [
    "Asia/Kolkata",
    "Asia/Mumbai", 
    "Asia/Delhi",
    "UTC"
  ];

  const holidayCalendars = [
    "India (National)",
    "India (Regional - North)",
    "India (Regional - South)",
    "Custom"
  ];

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="shadow-enterprise">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-primary" />
            <span>Basic Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                value={campaign.name}
                onChange={(e) => updateCampaign({ name: e.target.value })}
                placeholder="Weekend VIP Bonus Campaign"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="pt-2">
                <Badge variant={campaign.status === "published" ? "default" : "secondary"} className="capitalize">
                  {campaign.status}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="campaign-description">Description</Label>
            <Textarea
              id="campaign-description"
              value={campaign.description}
              onChange={(e) => updateCampaign({ description: e.target.value })}
              placeholder="Describe the campaign objectives and target audience..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Execution Settings */}
      <Card className="shadow-enterprise">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Execution Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select 
                value={campaign.timezone} 
                onValueChange={(value) => updateCampaign({ timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map(tz => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Used for time-based conditions when customer timezone is unknown
              </p>
            </div>

            <div className="space-y-2">
              <Label>Holiday Calendar</Label>
              <Select 
                value={campaign.holidayCalendar} 
                onValueChange={(value) => updateCampaign({ holidayCalendar: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {holidayCalendars.map(cal => (
                    <SelectItem key={cal} value={cal}>
                      {cal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Defines which dates are considered holidays for is_holiday conditions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conflict Resolution */}
      <Card className="shadow-enterprise">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>Conflict Resolution</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Conflict Policy</Label>
            <Select 
              value={campaign.conflictPolicy} 
              onValueChange={(value: "allow_all" | "first_match" | "highest_payout") => 
                updateCampaign({ conflictPolicy: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {conflictPolicies.map(policy => (
                  <SelectItem key={policy.value} value={policy.value}>
                    <div>
                      <div className="font-medium">{policy.label}</div>
                      <div className="text-xs text-muted-foreground">{policy.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="p-3 bg-accent/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {conflictPolicies.find(p => p.value === campaign.conflictPolicy)?.description}
              </p>
            </div>
          </div>

          {campaign.conflictPolicy === "first_match" && (
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning-foreground">
                <strong>Note:</strong> Rule order matters when "First Match" is selected. 
                Drag rules in the canvas to reorder them.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Runtime Settings */}
      <Card className="shadow-enterprise">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Runtime & Safety</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Idempotency Window</Label>
              <Select defaultValue="24h">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Duration to prevent duplicate effect issuance on event retries
              </p>
            </div>

            <div className="space-y-2">
              <Label>Error Handling</Label>
              <Select defaultValue="notify">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notify">Notify Admin & User</SelectItem>
                  <SelectItem value="admin-only">Notify Admin Only</SelectItem>
                  <SelectItem value="silent">Silent Failure</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How to handle processing errors (data fetch, ESP outage, etc.)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignSettings;