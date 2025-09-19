import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Zap, Calculator, Gift, Mail, Star, Users } from "lucide-react";
import type { Effect } from "../AdvancedBuilder";

interface EffectsEditorProps {
  effects: Effect[];
  elseEffects: Effect[];
  onUpdateEffects: (effects: Effect[]) => void;
  onUpdateElseEffects: (elseEffects: Effect[]) => void;
}

const effectTypes = [
  { 
    id: "award_points", 
    label: "Award Points", 
    icon: Zap, 
    description: "Award loyalty points using a formula",
    color: "text-amber-500"
  },
  { 
    id: "create_coupon", 
    label: "Create Coupon", 
    icon: Gift, 
    description: "Generate a discount coupon",
    color: "text-green-500"
  },
  { 
    id: "send_email", 
    label: "Send Email", 
    icon: Mail, 
    description: "Send notification or promotional email",
    color: "text-blue-500"
  },
  { 
    id: "update_tier", 
    label: "Update Tier", 
    icon: Star, 
    description: "Change customer tier/status",
    color: "text-purple-500"
  },
  { 
    id: "add_to_segment", 
    label: "Add to Segment", 
    icon: Users, 
    description: "Add customer to marketing segment",
    color: "text-cyan-500"
  }
];

const EffectsEditor: React.FC<EffectsEditorProps> = ({ 
  effects, 
  elseEffects, 
  onUpdateEffects, 
  onUpdateElseEffects 
}) => {
  const [activeTab, setActiveTab] = useState<"effects" | "else">("effects");

  const addEffect = (effectType: string, isElse: boolean = false) => {
    const newEffect: Effect = {
      id: `effect-${Date.now()}`,
      type: effectType as Effect["type"],
      parameters: getDefaultParameters(effectType)
    };

    if (isElse) {
      onUpdateElseEffects([...elseEffects, newEffect]);
    } else {
      onUpdateEffects([...effects, newEffect]);
    }
  };

  const removeEffect = (effectId: string, isElse: boolean = false) => {
    if (isElse) {
      onUpdateElseEffects(elseEffects.filter(e => e.id !== effectId));
    } else {
      onUpdateEffects(effects.filter(e => e.id !== effectId));
    }
  };

  const updateEffect = (effectId: string, updates: Partial<Effect>, isElse: boolean = false) => {
    const updateList = isElse ? elseEffects : effects;
    const updateFn = isElse ? onUpdateElseEffects : onUpdateEffects;
    
    updateFn(updateList.map(e => e.id === effectId ? { ...e, ...updates } : e));
  };

  const getDefaultParameters = (effectType: string): Record<string, any> => {
    switch (effectType) {
      case "award_points":
        return { formula: "purchase_amount * 1", description: "" };
      case "create_coupon":
        return { 
          value: 0, 
          type: "percentage", 
          code: "single-use",
          stackable: false,
          channels: ["POS", "web", "app"],
          validityDays: 30,
          name: "",
          description: ""
        };
      case "send_email":
        return { template: "", subject: "", personalizations: {} };
      case "update_tier":
        return { newTier: "", reason: "" };
      case "add_to_segment":
        return { segmentId: "", segmentName: "" };
      default:
        return {};
    }
  };

  const renderEffectCard = (effect: Effect, isElse: boolean = false) => {
    const effectType = effectTypes.find(t => t.id === effect.type);
    const Icon = effectType?.icon || Zap;

    return (
      <Card key={effect.id} className="shadow-sm border-l-4 border-l-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-accent/30 ${effectType?.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">{effectType?.label}</h4>
                <p className="text-sm text-muted-foreground">{effectType?.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeEffect(effect.id, isElse)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {renderEffectParameters(effect, isElse)}
        </CardContent>
      </Card>
    );
  };

  const renderEffectParameters = (effect: Effect, isElse: boolean = false) => {
    switch (effect.type) {
      case "award_points":
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Points Formula</Label>
              <div className="relative">
                <Calculator className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10 font-mono"
                  value={effect.parameters.formula || ""}
                  onChange={(e) => updateEffect(effect.id, { 
                    parameters: { ...effect.parameters, formula: e.target.value }
                  }, isElse)}
                  placeholder="purchase_amount * 2 + 500"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Available fields: purchase_amount, lifetime_value, items_count, account_age_days
                <br />
                Functions: min(), max(), floor(), ceil(), round()
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Input
                value={effect.parameters.description || ""}
                onChange={(e) => updateEffect(effect.id, { 
                  parameters: { ...effect.parameters, description: e.target.value }
                }, isElse)}
                placeholder="Weekend bonus points"
              />
            </div>
          </div>
        );

      case "create_coupon":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Coupon Name</Label>
                <Input
                  value={effect.parameters.name || ""}
                  onChange={(e) => updateEffect(effect.id, { 
                    parameters: { ...effect.parameters, name: e.target.value }
                  }, isElse)}
                  placeholder="Weekend Special"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Value Type</Label>
                <Select
                  value={effect.parameters.type || "percentage"}
                  onValueChange={(value) => updateEffect(effect.id, { 
                    parameters: { ...effect.parameters, type: value }
                  }, isElse)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Value</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={effect.parameters.value || 0}
                    onChange={(e) => updateEffect(effect.id, { 
                      parameters: { ...effect.parameters, value: parseFloat(e.target.value) }
                    }, isElse)}
                    placeholder="25"
                  />
                  <span className="absolute right-3 top-3 text-sm text-muted-foreground">
                    {effect.parameters.type === "percentage" ? "%" : "₹"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Code Type</Label>
                <Select
                  value={effect.parameters.code || "single-use"}
                  onValueChange={(value) => updateEffect(effect.id, { 
                    parameters: { ...effect.parameters, code: value }
                  }, isElse)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-use">Single Use</SelectItem>
                    <SelectItem value="multi-use">Multi Use</SelectItem>
                    <SelectItem value="public">Public Code</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Validity (Days)</Label>
                <Input
                  type="number"
                  value={effect.parameters.validityDays || 30}
                  onChange={(e) => updateEffect(effect.id, { 
                    parameters: { ...effect.parameters, validityDays: parseInt(e.target.value) }
                  }, isElse)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={effect.parameters.stackable || false}
                  onCheckedChange={(checked) => updateEffect(effect.id, { 
                    parameters: { ...effect.parameters, stackable: checked }
                  }, isElse)}
                />
                <Label>Stackable with other coupons</Label>
              </div>
            </div>
          </div>
        );

      case "update_tier":
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>New Tier</Label>
              <Select
                value={effect.parameters.newTier || ""}
                onValueChange={(value) => updateEffect(effect.id, { 
                  parameters: { ...effect.parameters, newTier: value }
                }, isElse)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bronze">Bronze</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Platinum">Platinum</SelectItem>
                  <SelectItem value="Diamond">Diamond</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Reason</Label>
              <Input
                value={effect.parameters.reason || ""}
                onChange={(e) => updateEffect(effect.id, { 
                  parameters: { ...effect.parameters, reason: e.target.value }
                }, isElse)}
                placeholder="Achieved LTV milestone"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground">
            Configuration panel for {effect.type} coming soon...
          </div>
        );
    }
  };

  const renderEffectsList = (effectsList: Effect[], isElse: boolean = false) => {
    return (
      <div className="space-y-4">
        {effectsList.length > 0 ? (
          <div className="space-y-4">
            {effectsList.map(effect => renderEffectCard(effect, isElse))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No {isElse ? "else " : ""}effects added yet</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {effectTypes.map(effectType => {
            const Icon = effectType.icon;
            return (
              <Button
                key={effectType.id}
                variant="outline"
                size="sm"
                onClick={() => addEffect(effectType.id, isElse)}
                className="flex items-center space-x-2"
              >
                <Icon className={`h-4 w-4 ${effectType.color}`} />
                <span>Add {effectType.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Effects Tab Navigation */}
      <div className="flex space-x-1 bg-accent rounded-lg p-1">
        <button
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "effects"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("effects")}
        >
          Effects ({effects.length})
        </button>
        <button
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "else"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("else")}
        >
          Else Effects ({elseEffects.length})
        </button>
      </div>

      {/* Effects Content */}
      {activeTab === "effects" ? (
        <Card className="shadow-enterprise">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Effects</span>
              <Badge variant="outline">{effects.length}</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Actions to execute when the rule's conditions are met
            </p>
          </CardHeader>
          <CardContent>
            {renderEffectsList(effects, false)}
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-enterprise">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-orange-500" />
              <span>Else Effects</span>
              <Badge variant="outline">{elseEffects.length}</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Actions to execute when the rule's conditions are NOT met
            </p>
          </CardHeader>
          <CardContent>
            {renderEffectsList(elseEffects, true)}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EffectsEditor;