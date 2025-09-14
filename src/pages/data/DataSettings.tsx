import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Settings, Bot, Zap, ShieldCheck, TestTube } from "lucide-react";

const DataSettings = () => {
  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Data Settings</h1>
            <p className="text-muted-foreground">Configure LLM integration and system preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LLM Configuration */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">LLM Configuration</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Enable LLM Integration</Label>
                    <p className="text-xs text-muted-foreground">Use AI for intelligent relationship mapping</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Select defaultValue="openai">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="azure">Azure OpenAI</SelectItem>
                      <SelectItem value="custom">Custom Endpoint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Endpoint URL</Label>
                  <Input 
                    placeholder="https://api.openai.com/v1/chat/completions"
                    defaultValue="https://api.openai.com/v1/chat/completions"
                  />
                </div>

                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input 
                    type="password"
                    placeholder="sk-..."
                    defaultValue="••••••••••••••••••••••••••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Model</Label>
                  <Select defaultValue="gpt-4">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-3">Claude 3 Sonnet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button size="default" className="flex-1">
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                  <Badge variant="outline" className="px-3 py-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Connected
                  </Badge>
                </div>

                <div className="border-t pt-4">
                  <Label className="text-sm font-medium mb-3 block">Sample Request/Response</Label>
                  <div className="space-y-2">
                    <div className="text-xs">
                      <div className="text-muted-foreground mb-1">Request:</div>
                      <Textarea 
                        className="text-xs font-mono h-20" 
                        readOnly
                        value={`{
  "model": "gpt-4",
  "messages": [
    {"role": "system", "content": "Analyze data relationships..."},
    {"role": "user", "content": "Find relationships between entities..."}
  ]
}`}
                      />
                    </div>
                    <div className="text-xs">
                      <div className="text-muted-foreground mb-1">Response:</div>
                      <Textarea 
                        className="text-xs font-mono h-16" 
                        readOnly
                        value={`{
  "relationships": [
    {"source": "customers", "target": "transactions", "confidence": 0.95}
  ]
}`}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mapping & Validation Preferences */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Mapping Preferences</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Auto-discovery Default</Label>
                    <p className="text-xs text-muted-foreground">Automatically run discovery on file upload</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Minimum Confidence Threshold</Label>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <Slider defaultValue={[75]} max={100} min={50} step={5} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Require Manual Confirmation</Label>
                    <p className="text-xs text-muted-foreground">Review all discovered relationships</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Prefer LLM over Rules</Label>
                    <p className="text-xs text-muted-foreground">Use AI findings when both available</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Fallback to Rules</Label>
                    <p className="text-xs text-muted-foreground">Use rule-based discovery if LLM fails</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Validation Preferences</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Strict Mode</Label>
                    <p className="text-xs text-muted-foreground">Reject records on any validation failure</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Auto-fix Enabled</Label>
                    <p className="text-xs text-muted-foreground">Automatically fix common issues</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Quarantine Threshold</Label>
                    <span className="text-sm text-muted-foreground">5%</span>
                  </div>
                  <Slider defaultValue={[5]} max={20} min={1} step={1} />
                  <p className="text-xs text-muted-foreground">Maximum percentage of records to quarantine</p>
                </div>

                <div className="space-y-2">
                  <Label>Maximum Retry Attempts</Label>
                  <Input type="number" defaultValue="3" min="1" max="10" />
                </div>

                <div className="space-y-2">
                  <Label>Processing Timeout (seconds)</Label>
                  <Input type="number" defaultValue="300" min="30" max="3600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Settings</Button>
        </div>
      </div>
    </Layout>
  );
};

export default DataSettings;