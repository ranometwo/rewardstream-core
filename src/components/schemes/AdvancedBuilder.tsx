import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Play, Settings, Code2, TestTube } from "lucide-react";
import CampaignSettings from "./advanced/CampaignSettings";
import RuleCanvas from "./advanced/RuleCanvas";
import TestingPanel from "./advanced/TestingPanel";
import BudgetManager from "./advanced/BudgetManager";

export interface Campaign {
  id: string;
  name: string;
  description: string;
  timezone: string;
  holidayCalendar: string;
  conflictPolicy: "allow_all" | "first_match" | "highest_payout";
  status: "draft" | "published" | "paused";
  rules: Rule[];
  budgets: CampaignBudgets;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  conditions: ConditionGroup;
  effects: Effect[];
  elseEffects: Effect[];
}

export interface ConditionGroup {
  id: string;
  operator: "ALL" | "ANY" | "NOT";
  children: (SimpleCondition | ConditionGroup)[];
}

export interface SimpleCondition {
  id: string;
  field: string;
  operator: string;
  value: any;
  type: "simple";
}

export interface Effect {
  id: string;
  type: "award_points" | "create_coupon" | "send_email" | "update_tier" | "add_to_segment";
  parameters: Record<string, any>;
}

export interface CampaignBudgets {
  totalPointsCap: number | null;
  totalCouponCap: number | null;
  softCapThreshold: number;
  hardCapThreshold: number;
  perUserDailyCap: number | null;
  perUserMonthlyCap: number | null;
}

interface AdvancedBuilderProps {
  onBack: () => void;
}

const AdvancedBuilder: React.FC<AdvancedBuilderProps> = ({ onBack }) => {
  const [campaign, setCampaign] = useState<Campaign>({
    id: "new-campaign",
    name: "New Campaign",
    description: "",
    timezone: "Asia/Kolkata",
    holidayCalendar: "India",
    conflictPolicy: "allow_all",
    status: "draft",
    rules: [],
    budgets: {
      totalPointsCap: null,
      totalCouponCap: null,
      softCapThreshold: 80,
      hardCapThreshold: 95,
      perUserDailyCap: null,
      perUserMonthlyCap: null,
    }
  });

  const [activeTab, setActiveTab] = useState("rules");
  const [isTestPanelOpen, setIsTestPanelOpen] = useState(false);

  const updateCampaign = (updates: Partial<Campaign>) => {
    setCampaign(prev => ({ ...prev, ...updates }));
  };

  const handleSaveDraft = () => {
    console.log("Saving campaign draft:", campaign);
  };

  const handlePublish = () => {
    console.log("Publishing campaign:", campaign);
    updateCampaign({ status: "published" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "default";
      case "paused": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card shadow-enterprise sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Schemes
            </Button>
            <div className="h-6 w-px bg-border" />
            <div>
              <div className="flex items-center space-x-3">
                <Code2 className="h-5 w-5 text-primary" />
                <h1 className="text-xl font-semibold text-foreground">
                  {campaign.name}
                </h1>
                <Badge variant={getStatusColor(campaign.status)} className="capitalize">
                  {campaign.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Advanced Rule Builder • {campaign.rules.length} rules configured
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setIsTestPanelOpen(!isTestPanelOpen)}
              className={isTestPanelOpen ? "bg-accent" : ""}
            >
              <TestTube className="h-4 w-4 mr-2" />
              Test Rules
            </Button>
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button 
              onClick={handlePublish} 
              className="bg-gradient-primary shadow-glass"
              disabled={campaign.status === "published"}
            >
              <Play className="h-4 w-4 mr-2" />
              {campaign.status === "published" ? "Published" : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 ${isTestPanelOpen ? 'mr-96' : ''} transition-all duration-300`}>
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="rules" className="flex items-center space-x-2">
                  <Code2 className="h-4 w-4" />
                  <span>Rules Canvas</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Campaign Settings</span>
                </TabsTrigger>
                <TabsTrigger value="budgets" className="flex items-center space-x-2">
                  <span>Budgets & Caps</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="rules">
                <RuleCanvas 
                  campaign={campaign}
                  updateCampaign={updateCampaign}
                />
              </TabsContent>

              <TabsContent value="settings">
                <CampaignSettings 
                  campaign={campaign}
                  updateCampaign={updateCampaign}
                />
              </TabsContent>

              <TabsContent value="budgets">
                <BudgetManager 
                  campaign={campaign}
                  updateCampaign={updateCampaign}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Testing Panel */}
        {isTestPanelOpen && (
          <div className="w-96 border-l bg-card shadow-elevated fixed right-0 top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
            <TestingPanel 
              campaign={campaign}
              onClose={() => setIsTestPanelOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedBuilder;