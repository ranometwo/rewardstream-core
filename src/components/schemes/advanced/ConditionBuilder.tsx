import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Move, Filter } from "lucide-react";
import type { ConditionGroup, SimpleCondition } from "../AdvancedBuilder";

interface ConditionBuilderProps {
  conditionGroup: ConditionGroup;
  onUpdateConditions: (conditions: ConditionGroup) => void;
  depth?: number;
}

const fieldDefinitions = [
  // Purchase fields
  { id: "purchase_amount", label: "Purchase Amount", type: "number", category: "Purchase", unit: "₹" },
  { id: "product_category", label: "Product Category", type: "string", category: "Purchase" },
  { id: "items_count", label: "Items Count", type: "number", category: "Purchase" },
  
  // Customer fields
  { id: "member_tier", label: "Member Tier", type: "enum", category: "Customer", 
    options: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"] },
  { id: "lifetime_value", label: "Lifetime Value", type: "number", category: "Customer", unit: "₹" },
  { id: "account_age_days", label: "Account Age", type: "number", category: "Customer", unit: "days" },
  
  // Time fields
  { id: "day_of_week", label: "Day of Week", type: "enum", category: "Time",
    options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
  { id: "hour_of_day", label: "Hour of Day", type: "number", category: "Time", min: 0, max: 23 },
  { id: "is_holiday", label: "Is Holiday", type: "boolean", category: "Time" },
  
  // Special fields
  { id: "first_purchase_month", label: "First Purchase Month", type: "boolean", category: "Special" },
  { id: "birthday_month", label: "Birthday Month", type: "boolean", category: "Special" },
];

const operatorsByType = {
  number: [
    { value: "==", label: "equals" },
    { value: "!=", label: "not equals" },
    { value: ">", label: "greater than" },
    { value: ">=", label: "greater than or equal" },
    { value: "<", label: "less than" },
    { value: "<=", label: "less than or equal" },
    { value: "between", label: "between" },
    { value: "exists", label: "exists" },
    { value: "not_exists", label: "does not exist" }
  ],
  string: [
    { value: "==", label: "equals" },
    { value: "!=", label: "not equals" },
    { value: "contains", label: "contains" },
    { value: "starts_with", label: "starts with" },
    { value: "ends_with", label: "ends with" },
    { value: "exists", label: "exists" },
    { value: "not_exists", label: "does not exist" }
  ],
  enum: [
    { value: "in", label: "is one of" },
    { value: "not_in", label: "is not one of" },
    { value: "exists", label: "exists" },
    { value: "not_exists", label: "does not exist" }
  ],
  boolean: [
    { value: "==", label: "is" },
    { value: "exists", label: "exists" },
    { value: "not_exists", label: "does not exist" }
  ]
};

const ConditionBuilder: React.FC<ConditionBuilderProps> = ({ 
  conditionGroup, 
  onUpdateConditions, 
  depth = 0 
}) => {
  const addSimpleCondition = () => {
    const newCondition: SimpleCondition = {
      id: `condition-${Date.now()}`,
      field: "",
      operator: "",
      value: null,
      type: "simple"
    };

    onUpdateConditions({
      ...conditionGroup,
      children: [...conditionGroup.children, newCondition]
    });
  };

  const addConditionGroup = () => {
    const newGroup: ConditionGroup = {
      id: `group-${Date.now()}`,
      operator: "ALL",
      children: []
    };

    onUpdateConditions({
      ...conditionGroup,
      children: [...conditionGroup.children, newGroup]
    });
  };

  const removeCondition = (conditionId: string) => {
    onUpdateConditions({
      ...conditionGroup,
      children: conditionGroup.children.filter(child => child.id !== conditionId)
    });
  };

  const updateCondition = (conditionId: string, updates: any) => {
    onUpdateConditions({
      ...conditionGroup,
      children: conditionGroup.children.map(child =>
        child.id === conditionId ? { ...child, ...updates } : child
      )
    });
  };

  const updateGroupOperator = (operator: "ALL" | "ANY" | "NOT") => {
    onUpdateConditions({
      ...conditionGroup,
      operator
    });
  };

  const renderConditionRow = (condition: SimpleCondition) => {
    const field = fieldDefinitions.find(f => f.id === condition.field);
    const operators = field ? operatorsByType[field.type as keyof typeof operatorsByType] || [] : [];
    
    return (
      <div key={condition.id} className="flex items-center space-x-3 p-3 bg-accent/30 rounded-lg">
        <Move className="h-4 w-4 text-muted-foreground cursor-grab" />
        
        <div className="flex-1 grid grid-cols-4 gap-3">
          {/* Field */}
          <Select
            value={condition.field}
            onValueChange={(value) => updateCondition(condition.id, { field: value, operator: "", value: null })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(
                fieldDefinitions.reduce((acc, field) => {
                  if (!acc[field.category]) acc[field.category] = [];
                  acc[field.category].push(field);
                  return acc;
                }, {} as Record<string, typeof fieldDefinitions>)
              ).map(([category, fields]) => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {category}
                  </div>
                  {fields.map(field => (
                    <SelectItem key={field.id} value={field.id}>
                      <div className="flex items-center space-x-2">
                        <span>{field.label}</span>
                        {field.unit && (
                          <Badge variant="outline" className="text-xs">
                            {field.unit}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>

          {/* Operator */}
          <Select
            value={condition.operator}
            onValueChange={(value) => updateCondition(condition.id, { operator: value, value: null })}
            disabled={!condition.field}
          >
            <SelectTrigger>
              <SelectValue placeholder="Operator" />
            </SelectTrigger>
            <SelectContent>
              {operators.map(op => (
                <SelectItem key={op.value} value={op.value}>
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Value */}
          <div className="col-span-1">
            {renderValueInput(condition, field)}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeCondition(condition.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const renderValueInput = (condition: SimpleCondition, field: any) => {
    if (!condition.operator || ["exists", "not_exists"].includes(condition.operator)) {
      return null;
    }

    if (field?.type === "boolean") {
      return (
        <Select
          value={condition.value?.toString()}
          onValueChange={(value) => updateCondition(condition.id, { value: value === "true" })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Value" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">True</SelectItem>
            <SelectItem value="false">False</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    if (field?.type === "enum") {
      return (
        <Select
          value={condition.value}
          onValueChange={(value) => updateCondition(condition.id, { value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option: string) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (condition.operator === "between") {
      return (
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="Min"
            value={condition.value?.[0] || ""}
            onChange={(e) => updateCondition(condition.id, { 
              value: [e.target.value, condition.value?.[1] || ""]
            })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={condition.value?.[1] || ""}
            onChange={(e) => updateCondition(condition.id, { 
              value: [condition.value?.[0] || "", e.target.value]
            })}
          />
        </div>
      );
    }

    return (
      <Input
        type={field?.type === "number" ? "number" : "text"}
        placeholder="Value"
        value={condition.value || ""}
        onChange={(e) => updateCondition(condition.id, { 
          value: field?.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value 
        })}
      />
    );
  };

  const renderNestedGroup = (group: ConditionGroup) => {
    return (
      <div key={group.id} className="ml-6 border-l-2 border-border pl-4">
        <ConditionBuilder
          conditionGroup={group}
          onUpdateConditions={(updatedGroup) => updateCondition(group.id, updatedGroup)}
          depth={depth + 1}
        />
      </div>
    );
  };

  return (
    <Card className="shadow-enterprise">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary" />
            <span>Conditions</span>
            {depth > 0 && (
              <Badge variant="outline" className="text-xs">
                Nested Group
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Match:</span>
            <div className="flex bg-accent rounded-lg p-1">
              {["ALL", "ANY", "NOT"].map(op => (
                <Button
                  key={op}
                  variant="ghost"
                  size="sm"
                  className={`px-3 py-1 text-xs ${
                    conditionGroup.operator === op 
                      ? "bg-background shadow-sm" 
                      : "hover:bg-background/50"
                  }`}
                  onClick={() => updateGroupOperator(op as "ALL" | "ANY" | "NOT")}
                  disabled={op === "NOT" && conditionGroup.children.length > 1}
                >
                  {op}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {conditionGroup.operator === "NOT" && conditionGroup.children.length > 1 && (
          <div className="text-sm text-warning-foreground bg-warning/10 border border-warning/20 rounded p-2">
            NOT groups can only have one child condition or group.
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {conditionGroup.children.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No conditions added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conditionGroup.children.map(child => (
              child.type === "simple" 
                ? renderConditionRow(child as SimpleCondition)
                : renderNestedGroup(child as ConditionGroup)
            ))}
          </div>
        )}

        <div className="flex items-center space-x-2 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={addSimpleCondition}
            disabled={conditionGroup.operator === "NOT" && conditionGroup.children.length >= 1}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Condition
          </Button>
          
          {depth < 3 && (
            <Button
              variant="outline"
              size="sm"
              onClick={addConditionGroup}
              disabled={conditionGroup.operator === "NOT" && conditionGroup.children.length >= 1}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Group
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConditionBuilder;