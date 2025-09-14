import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Plus, TestTube, Save, Edit, Trash2, AlertTriangle } from "lucide-react";

const ValidationCenter = () => {
  const validationRules = [
    {
      id: 1,
      name: "Customer ID Required",
      entity: "Customers",
      field: "customer_id", 
      condition: "Required",
      action: "Reject record",
      active: true
    },
    {
      id: 2,
      name: "Email Format Check",
      entity: "Customers",
      field: "email",
      condition: "Pattern (email)",
      action: "Quarantine for review",
      active: true
    },
    {
      id: 3,
      name: "Age Range Validation",
      entity: "Customers", 
      field: "age",
      condition: "Range (18-100)",
      action: "Auto-fix with default",
      active: false
    }
  ];

  const validationResults = [
    {
      row: 1245,
      field: "email",
      current: "invalid-email",
      expected: "Valid email format",
      rule: "Email Format Check",
      suggested: "mark as invalid"
    },
    {
      row: 2103,
      field: "age", 
      current: "150",
      expected: "18-100",
      rule: "Age Range Validation",
      suggested: "Set to 25 (median)"
    },
    {
      row: 3456,
      field: "customer_id",
      current: null,
      expected: "Not null/empty", 
      rule: "Customer ID Required",
      suggested: "Generate UUID"
    }
  ];

  const quarantineRecords = [
    {
      id: 1,
      row: 1245,
      data: { customer_id: "CUST1245", email: "invalid-email", age: 28 },
      errors: ["Invalid email format"],
      status: "pending"
    },
    {
      id: 2, 
      row: 2103,
      data: { customer_id: "CUST2103", email: "john@email.com", age: 150 },
      errors: ["Age out of range"],
      status: "pending"
    }
  ];

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Validation Center</h1>
            <p className="text-muted-foreground">Create rules and manage data quality</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
          {/* Rule Builder */}
          <div className="col-span-4">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Rule Builder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Rule Name</Label>
                  <Input placeholder="Enter rule name" />
                </div>

                <div className="space-y-2">
                  <Label>Entity</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customers">Customers</SelectItem>
                      <SelectItem value="products">Products</SelectItem>
                      <SelectItem value="transactions">Transactions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Field</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer_id">customer_id</SelectItem>
                      <SelectItem value="email">email</SelectItem>
                      <SelectItem value="age">age</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Condition Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="required">Required (not null/empty)</SelectItem>
                      <SelectItem value="unique">Unique (no duplicates)</SelectItem>
                      <SelectItem value="pattern">Pattern (regex match)</SelectItem>
                      <SelectItem value="range">Range (min/max values)</SelectItem>
                      <SelectItem value="list">List (allowed values)</SelectItem>
                      <SelectItem value="custom">Custom (JavaScript)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Action on Failure</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reject">Reject record</SelectItem>
                      <SelectItem value="quarantine">Quarantine for review</SelectItem>
                      <SelectItem value="autofix">Auto-fix with default</SelectItem>
                      <SelectItem value="warning">Warning only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="default" className="flex-1">
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Rule
                  </Button>
                  <Button size="default" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Rule
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium">Active Rules</Label>
                    <Button size="default" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {validationRules.map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between p-2 border rounded text-xs">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{rule.name}</div>
                          <div className="text-muted-foreground">{rule.entity}.{rule.field}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Switch checked={rule.active} />
                          <Button variant="ghost" size="default">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Validation Results */}
          <div className="col-span-5">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Validation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Summary Metrics */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-muted/50 rounded">
                      <div className="text-lg font-bold">15,420</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-600">15,017</div>
                      <div className="text-xs text-muted-foreground">Passed</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="text-lg font-bold text-red-600">403</div>
                      <div className="text-xs text-muted-foreground">Failed</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded">
                      <div className="text-lg font-bold text-orange-600">87</div>
                      <div className="text-xs text-muted-foreground">Fixed</div>
                    </div>
                  </div>

                  {/* Issues Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 p-2 text-xs font-medium grid grid-cols-6 gap-2">
                      <div>Row</div>
                      <div>Field</div>
                      <div>Current Value</div>
                      <div>Expected</div>
                      <div>Rule</div>
                      <div>Actions</div>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {validationResults.map((result, index) => (
                        <div key={index} className="p-2 text-xs border-t grid grid-cols-6 gap-2 items-center">
                          <div>{result.row}</div>
                          <div>{result.field}</div>
                          <div className="font-mono text-red-600">{result.current || "null"}</div>
                          <div className="text-muted-foreground">{result.expected}</div>
                          <div>{result.rule}</div>
                          <div className="flex gap-1">
                            <Button size="default" variant="outline" className="h-6 text-xs">Fix</Button>
                            <Button size="default" variant="outline" className="h-6 text-xs">Ignore</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="default" variant="outline">Fix All</Button>
                    <Button size="default" variant="outline">Ignore All</Button>
                    <Button size="default" variant="outline">Export Issues</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quarantine Manager */}
          <div className="col-span-3">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Quarantine Manager</CardTitle>
                  <Button size="default" variant="outline">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quarantineRecords.map((record) => (
                    <div key={record.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Row {record.row}</div>
                        <Badge variant="outline" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {record.status}
                        </Badge>
                      </div>
                      
                      <div className="text-xs space-y-1">
                        {Object.entries(record.data).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground">{key}:</span>
                            <span className={record.errors.some(e => e.toLowerCase().includes(key)) ? "text-red-600" : ""}>
                              {value || "null"}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-xs text-red-600">
                        {record.errors.join(", ")}
                      </div>
                      
                      <div className="flex gap-1">
                        <Button size="default" variant="outline" className="text-xs h-6">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="default" variant="outline" className="text-xs h-6">
                          Retry
                        </Button>
                        <Button size="default" variant="outline" className="text-xs h-6">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Button className="w-full" size="default">
                    Export to CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ValidationCenter;