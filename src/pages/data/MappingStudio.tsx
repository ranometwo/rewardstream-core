import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Network, Table, GitBranch, RotateCcw, Check, Plus, Eye } from "lucide-react";

const MappingStudio = () => {
  const entities = [
    { id: 1, name: "Customers", type: "Master", fields: 8, records: 15420, color: "bg-blue-100 border-blue-300" },
    { id: 2, name: "Products", type: "Master", fields: 12, records: 2340, color: "bg-green-100 border-green-300" },
    { id: 3, name: "Transactions", type: "Event", fields: 6, records: 45230, color: "bg-orange-100 border-orange-300" },
    { id: 4, name: "User Events", type: "Event", fields: 5, records: 128450, color: "bg-purple-100 border-purple-300" }
  ];

  const relationships = [
    {
      id: 1,
      source: "Customers",
      target: "Transactions", 
      joinColumns: ["customer_id"],
      cardinality: "1:N",
      confidence: 95,
      method: "LLM"
    },
    {
      id: 2,
      source: "Transactions",
      target: "Products",
      joinColumns: ["product_id"],
      cardinality: "N:1", 
      confidence: 88,
      method: "Rule-based"
    },
    {
      id: 3,
      source: "Customers",
      target: "User Events",
      joinColumns: ["customer_id"],
      cardinality: "1:N",
      confidence: 92,
      method: "LLM"
    }
  ];

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) return <Badge className="bg-green-100 text-green-800">High ({confidence}%)</Badge>;
    if (confidence >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Medium ({confidence}%)</Badge>;
    return <Badge className="bg-red-100 text-red-800">Low ({confidence}%)</Badge>;
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Network className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Mapping Studio</h1>
            <p className="text-muted-foreground">Discover and manage data relationships</p>
          </div>
        </div>

        {/* Control Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Tabs defaultValue="graph" className="w-auto">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="graph">
                      <Network className="h-4 w-4 mr-2" />
                      Graph
                    </TabsTrigger>
                    <TabsTrigger value="table">
                      <Table className="h-4 w-4 mr-2" />
                      Table
                    </TabsTrigger>
                    <TabsTrigger value="flow">
                      <GitBranch className="h-4 w-4 mr-2" />
                      Flow
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center gap-2">
                  <span className="text-sm">Auto-discovery</span>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm">Confidence</span>
                  <div className="w-24">
                    <Slider defaultValue={[80]} max={100} min={50} step={5} />
                  </div>
                  <span className="text-sm text-muted-foreground">80%</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset All
                </Button>
                <Button size="sm">
                  <Check className="h-4 w-4 mr-2" />
                  Confirm Mappings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Graph View */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Relationship Graph</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-[500px] bg-muted/30 rounded-lg p-6">
                  {/* Mock Graph Visualization */}
                  <div className="absolute inset-6 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
                      {entities.map((entity, index) => (
                        <div
                          key={entity.id}
                          className={`${entity.color} p-4 rounded-lg border-2 cursor-pointer hover:shadow-md transition-shadow`}
                        >
                          <div className="font-medium text-sm">{entity.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {entity.type} • {entity.fields} fields • {entity.records.toLocaleString()} records
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Connection Lines (Mock) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                      </marker>
                    </defs>
                    <line x1="25%" y1="35%" x2="75%" y2="35%" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <line x1="75%" y1="50%" x2="75%" y2="65%" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <line x1="25%" y1="50%" x2="25%" y2="65%" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                  </svg>
                  
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button variant="outline" size="sm">Zoom In</Button>
                    <Button variant="outline" size="sm">Zoom Out</Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Relationships Panel */}
          <div>
            <Card className="h-[600px]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Discovered Relationships</CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Manual
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {relationships.map((rel) => (
                    <div key={rel.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">
                          {rel.source} → {rel.target}
                        </div>
                        {getConfidenceBadge(rel.confidence)}
                      </div>
                      
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Join: {rel.joinColumns.join(", ")}</div>
                        <div>Cardinality: {rel.cardinality}</div>
                        <div>Method: {rel.method}</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          <Check className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Button className="w-full" size="sm">
                    Accept All High Confidence (3)
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

export default MappingStudio;