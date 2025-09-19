import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Eye, AlertTriangle } from "lucide-react";
import ConditionBuilder from "./ConditionBuilder";
import EffectsEditor from "./EffectsEditor";
import type { Rule, Campaign } from "../AdvancedBuilder";

interface RuleEditorProps {
  rule: Rule;
  onUpdateRule: (updates: Partial<Rule>) => void;
  onBack: () => void;
  campaign: Campaign;
}

const RuleEditor: React.FC<RuleEditorProps> = ({ rule, onUpdateRule, onBack, campaign }) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateRule = (): string[] => {
    const errors: string[] = [];
    
    if (!rule.name.trim()) {
      errors.push("Rule name is required");
    }
    
    if (rule.conditions.children.length === 0) {
      errors.push("At least one condition is required");
    }
    
    if (rule.effects.length === 0 && rule.elseEffects.length === 0) {
      errors.push("At least one effect (main or else) is required");
    }
    
    return errors;
  };

  const handleSave = () => {
    const errors = validateRule();
    setValidationErrors(errors);
    
    if (errors.length === 0) {
      console.log("Rule saved:", rule);
      onBack();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Canvas
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Rule Editor</h2>
            <p className="text-muted-foreground">
              Define conditions and effects for: {rule.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary shadow-glass">
            <Save className="h-4 w-4 mr-2" />
            Save Rule
          </Button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span>Validation Errors</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-destructive">
                  • {error}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card className="shadow-enterprise">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input
                id="rule-name"
                value={rule.name}
                onChange={(e) => onUpdateRule({ name: e.target.value })}
                placeholder="Weekend VIP Bonus"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rule-priority">Priority</Label>
              <Input
                id="rule-priority"
                type="number"
                value={rule.priority}
                onChange={(e) => onUpdateRule({ priority: parseInt(e.target.value) })}
                min={1}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rule-description">Description</Label>
            <Textarea
              id="rule-description"
              value={rule.description}
              onChange={(e) => onUpdateRule({ description: e.target.value })}
              placeholder="Describe what this rule does and when it should trigger..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rule Configuration */}
      <Tabs defaultValue="conditions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>

        <TabsContent value="conditions">
          <ConditionBuilder
            conditionGroup={rule.conditions}
            onUpdateConditions={(conditions) => onUpdateRule({ conditions })}
          />
        </TabsContent>

        <TabsContent value="effects">
          <EffectsEditor
            effects={rule.effects}
            elseEffects={rule.elseEffects}
            onUpdateEffects={(effects) => onUpdateRule({ effects })}
            onUpdateElseEffects={(elseEffects) => onUpdateRule({ elseEffects })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RuleEditor;