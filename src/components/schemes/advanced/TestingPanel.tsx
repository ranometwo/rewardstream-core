import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Play, Save, CheckCircle, XCircle, AlertTriangle, Plus } from "lucide-react";
import type { Campaign } from "../AdvancedBuilder";

interface TestingPanelProps {
  campaign: Campaign;
  onClose: () => void;
}

interface TestCase {
  id: string;
  name: string;
  payload: Record<string, any>;
  results?: TestResult[];
}

interface TestResult {
  ruleId: string;
  ruleName: string;
  matched: boolean;
  effects: any[];
  trace: TraceNode[];
}

interface TraceNode {
  id: string;
  type: "condition" | "group";
  description: string;
  result: boolean;
  children?: TraceNode[];
}

const TestingPanel: React.FC<TestingPanelProps> = ({ campaign, onClose }) => {
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: "default",
      name: "Default Test",
      payload: {
        purchase_amount: 250,
        member_tier: "Gold",
        day_of_week: "Saturday",
        first_purchase_month: false,
        birthday_month: true
      }
    }
  ]);
  
  const [activeTestCase, setActiveTestCase] = useState("default");
  const [isRunning, setIsRunning] = useState(false);

  const fieldTemplates = [
    { field: "purchase_amount", label: "Purchase Amount", type: "number", defaultValue: 250 },
    { field: "product_category", label: "Product Category", type: "string", defaultValue: "Electronics" },
    { field: "items_count", label: "Items Count", type: "number", defaultValue: 3 },
    { field: "member_tier", label: "Member Tier", type: "select", 
      options: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"], defaultValue: "Gold" },
    { field: "lifetime_value", label: "Lifetime Value", type: "number", defaultValue: 50000 },
    { field: "account_age_days", label: "Account Age (Days)", type: "number", defaultValue: 365 },
    { field: "day_of_week", label: "Day of Week", type: "select",
      options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], 
      defaultValue: "Saturday" },
    { field: "hour_of_day", label: "Hour of Day", type: "number", defaultValue: 14 },
    { field: "is_holiday", label: "Is Holiday", type: "boolean", defaultValue: false },
    { field: "first_purchase_month", label: "First Purchase Month", type: "boolean", defaultValue: false },
    { field: "birthday_month", label: "Birthday Month", type: "boolean", defaultValue: true }
  ];

  const getCurrentTestCase = () => {
    return testCases.find(tc => tc.id === activeTestCase) || testCases[0];
  };

  const updateTestCasePayload = (field: string, value: any) => {
    setTestCases(prev => prev.map(tc => 
      tc.id === activeTestCase 
        ? { ...tc, payload: { ...tc.payload, [field]: value } }
        : tc
    ));
  };

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: `test-${Date.now()}`,
      name: `Test Case ${testCases.length + 1}`,
      payload: {}
    };
    
    setTestCases(prev => [...prev, newTestCase]);
    setActiveTestCase(newTestCase.id);
  };

  const runTest = async () => {
    setIsRunning(true);
    
    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentTest = getCurrentTestCase();
    const mockResults: TestResult[] = campaign.rules.map(rule => ({
      ruleId: rule.id,
      ruleName: rule.name,
      matched: Math.random() > 0.5, // Random for demo
      effects: rule.effects.map(e => ({ type: e.type, computed: "sample result" })),
      trace: [
        {
          id: "trace-1",
          type: "group",
          description: `Group: ${rule.conditions.operator}`,
          result: true,
          children: [
            {
              id: "trace-2", 
              type: "condition",
              description: "purchase_amount >= 150 → true",
              result: true
            }
          ]
        }
      ]
    }));

    setTestCases(prev => prev.map(tc => 
      tc.id === activeTestCase 
        ? { ...tc, results: mockResults }
        : tc
    ));
    
    setIsRunning(false);
  };

  const renderPayloadEditor = () => {
    const currentTest = getCurrentTestCase();
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Test Payload</h4>
          <Button variant="outline" size="sm" onClick={runTest} disabled={isRunning}>
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? "Running..." : "Run Test"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
          {fieldTemplates.map(field => (
            <div key={field.field} className="space-y-2">
              <Label className="text-xs">{field.label}</Label>
              {field.type === "boolean" ? (
                <div className="flex space-x-2">
                  <Button
                    variant={currentTest.payload[field.field] === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateTestCasePayload(field.field, true)}
                  >
                    True
                  </Button>
                  <Button
                    variant={currentTest.payload[field.field] === false ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateTestCasePayload(field.field, false)}
                  >
                    False
                  </Button>
                </div>
              ) : field.type === "select" ? (
                <select
                  className="w-full px-3 py-2 text-sm border rounded-md"
                  value={currentTest.payload[field.field] || ""}
                  onChange={(e) => updateTestCasePayload(field.field, e.target.value)}
                >
                  <option value="">Select...</option>
                  {field.options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <Input
                  type={field.type === "number" ? "number" : "text"}
                  value={currentTest.payload[field.field] || ""}
                  onChange={(e) => updateTestCasePayload(field.field, 
                    field.type === "number" ? parseFloat(e.target.value) : e.target.value
                  )}
                  placeholder={field.defaultValue?.toString()}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const currentTest = getCurrentTestCase();
    
    if (!currentTest.results) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Run a test to see results</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h4 className="font-medium">Test Results</h4>
        
        {currentTest.results.map(result => (
          <Card key={result.ruleId} className={`border-l-4 ${
            result.matched ? "border-l-success" : "border-l-muted"
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {result.matched ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">{result.ruleName}</span>
                </div>
                <Badge variant={result.matched ? "default" : "secondary"}>
                  {result.matched ? "Matched" : "No Match"}
                </Badge>
              </div>
            </CardHeader>
            
            {result.matched && (
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-muted-foreground">Effects:</h5>
                  {result.effects.map((effect, idx) => (
                    <div key={idx} className="text-sm bg-accent/30 px-3 py-2 rounded">
                      {effect.type}: {effect.computed}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    );
  };

  const renderTrace = () => {
    const currentTest = getCurrentTestCase();
    
    if (!currentTest.results) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Run a test to see execution trace</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h4 className="font-medium">Execution Trace</h4>
        
        {currentTest.results.map(result => (
          <Card key={result.ruleId}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{result.ruleName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                {result.trace.map(node => (
                  <div key={node.id} className="space-y-1">
                    <div className={`flex items-center space-x-2 ${
                      node.result ? "text-success" : "text-destructive"
                    }`}>
                      {node.result ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      <span>{node.description}</span>
                    </div>
                    {node.children?.map(child => (
                      <div key={child.id} className={`ml-6 flex items-center space-x-2 ${
                        child.result ? "text-success" : "text-destructive"
                      }`}>
                        {child.result ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        <span className="text-xs">{child.description}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Rule Testing</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Test Case Tabs */}
      <div className="px-4 py-2 border-b">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {testCases.map(testCase => (
            <Button
              key={testCase.id}
              variant={activeTestCase === testCase.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTestCase(testCase.id)}
            >
              {testCase.name}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={addTestCase}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="payload" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-4">
            <TabsTrigger value="payload">Payload</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="trace">Trace</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="payload" className="mt-0">
              {renderPayloadEditor()}
            </TabsContent>

            <TabsContent value="results" className="mt-0">
              {renderResults()}
            </TabsContent>

            <TabsContent value="trace" className="mt-0">
              {renderTrace()}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default TestingPanel;