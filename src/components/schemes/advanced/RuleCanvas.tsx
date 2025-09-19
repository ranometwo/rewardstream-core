import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, Settings, GripVertical, Edit, Trash2, Copy } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import RuleEditor from "./RuleEditor";
import type { Campaign, Rule } from "../AdvancedBuilder";

interface RuleCanvasProps {
  campaign: Campaign;
  updateCampaign: (updates: Partial<Campaign>) => void;
}

const RuleCanvas: React.FC<RuleCanvasProps> = ({ campaign, updateCampaign }) => {
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const templates = [
    {
      id: "birthday-boost",
      name: "Birthday Month Boost",
      description: "3x points + 500 bonus during customer's birthday month",
      category: "Customer Lifecycle"
    },
    {
      id: "first-purchase",
      name: "First Purchase Welcome", 
      description: "₹250 off coupon for first-time buyers",
      category: "Acquisition"
    },
    {
      id: "weekend-vip",
      name: "Weekend VIP Bonus",
      description: "Premium rewards for VIP customers on weekends",
      category: "Engagement"
    },
    {
      id: "ltv-accelerator",
      name: "LTV Threshold Accelerator",
      description: "Tier upgrade and bonus for high-value customers",
      category: "Retention"
    }
  ];

  const createNewRule = () => {
    const newRule: Rule = {
      id: `rule-${Date.now()}`,
      name: "New Rule",
      description: "",
      enabled: true,
      priority: campaign.rules.length + 1,
      conditions: {
        id: `group-${Date.now()}`,
        operator: "ALL",
        children: []
      },
      effects: [],
      elseEffects: []
    };

    updateCampaign({
      rules: [...campaign.rules, newRule]
    });
    
    setEditingRule(newRule.id);
  };

  const createFromTemplate = (templateId: string) => {
    // Template creation logic would go here
    console.log("Creating rule from template:", templateId);
    setShowTemplates(false);
  };

  const duplicateRule = (ruleId: string) => {
    const rule = campaign.rules.find(r => r.id === ruleId);
    if (!rule) return;

    const newRule: Rule = {
      ...rule,
      id: `rule-${Date.now()}`,
      name: `${rule.name} (Copy)`,
      priority: campaign.rules.length + 1
    };

    updateCampaign({
      rules: [...campaign.rules, newRule]
    });
  };

  const deleteRule = (ruleId: string) => {
    updateCampaign({
      rules: campaign.rules.filter(r => r.id !== ruleId)
    });
  };

  const updateRule = (ruleId: string, updates: Partial<Rule>) => {
    updateCampaign({
      rules: campaign.rules.map(r => r.id === ruleId ? { ...r, ...updates } : r)
    });
  };

  const toggleRuleEnabled = (ruleId: string) => {
    const rule = campaign.rules.find(r => r.id === ruleId);
    if (rule) {
      updateRule(ruleId, { enabled: !rule.enabled });
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(campaign.rules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update priorities
    const updatedRules = items.map((rule, index) => ({
      ...rule,
      priority: index + 1
    }));

    updateCampaign({ rules: updatedRules });
  };

  if (editingRule) {
    const rule = campaign.rules.find(r => r.id === editingRule);
    if (rule) {
      return (
        <RuleEditor
          rule={rule}
          onUpdateRule={(updates) => updateRule(editingRule, updates)}
          onBack={() => setEditingRule(null)}
          campaign={campaign}
        />
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Rules Canvas</h2>
          <p className="text-muted-foreground">
            Define conditions and effects for your loyalty program
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button onClick={createNewRule} className="bg-gradient-primary shadow-glass">
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </div>
      </div>

      {/* Templates Panel */}
      {showTemplates && (
        <Card className="shadow-enterprise">
          <CardHeader>
            <CardTitle>Rule Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {templates.map(template => (
                <div
                  key={template.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => createFromTemplate(template.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conflict Policy Warning */}
      {campaign.conflictPolicy === "first_match" && campaign.rules.length > 1 && (
        <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <p className="text-sm text-warning-foreground">
            <strong>Order Matters:</strong> Rules are evaluated in the order shown below. 
            The first matching rule will be executed and evaluation will stop.
          </p>
        </div>
      )}

      {/* Rules List */}
      {campaign.rules.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="rules">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {campaign.rules.map((rule, index) => (
                  <Draggable key={rule.id} draggableId={rule.id} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`shadow-enterprise transition-all ${
                          snapshot.isDragging ? "shadow-elevated" : ""
                        } ${!rule.enabled ? "opacity-60" : ""}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab hover:text-primary"
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <Badge variant="outline" className="text-xs">
                                  #{rule.priority}
                                </Badge>
                                <div>
                                  <h3 className="font-semibold">{rule.name}</h3>
                                  {rule.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {rule.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={rule.enabled}
                                onCheckedChange={() => toggleRuleEnabled(rule.id)}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingRule(rule.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => duplicateRule(rule.id)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteRule(rule.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Conditions:</span>
                              <span className="ml-2">
                                {rule.conditions.children.length === 0
                                  ? "No conditions"
                                  : `${rule.conditions.children.length} condition(s)`
                                }
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Effects:</span>
                              <span className="ml-2">
                                {rule.effects.length + rule.elseEffects.length} effect(s)
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <Card className="shadow-enterprise">
          <CardContent className="py-12 text-center">
            <div className="max-w-md mx-auto">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Rules Configured
              </h3>
              <p className="text-muted-foreground mb-6">
                Create your first rule to define when and how rewards are awarded to your customers.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <Button onClick={createNewRule} className="bg-gradient-primary shadow-glass">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Rule
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowTemplates(true)}
                >
                  Browse Templates
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RuleCanvas;