import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, TrendingUp, ArrowUp, ArrowDown, Download, Search, Filter } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MonitoringDashboard = () => {
  const metrics = [
    {
      title: "Records Processed",
      value: "2.4M",
      change: "+12%",
      trend: "up",
      sparkline: [45, 52, 48, 61, 58, 67, 73]
    },
    {
      title: "Success Rate", 
      value: "97.3%",
      change: "+2.1%",
      trend: "up",
      sparkline: [92, 94, 96, 95, 97, 98, 97]
    },
    {
      title: "Processing Speed",
      value: "1,250/sec",
      change: "-5%", 
      trend: "down",
      sparkline: [1100, 1200, 1300, 1250, 1180, 1220, 1250]
    },
    {
      title: "Data Quality Score",
      value: "94/100",
      change: "+3",
      trend: "up",
      sparkline: [88, 89, 91, 92, 93, 94, 94]
    }
  ];

  const throughputData = [
    { time: "00:00", records: 1200 },
    { time: "04:00", records: 800 },
    { time: "08:00", records: 2100 },
    { time: "12:00", records: 2800 },
    { time: "16:00", records: 2400 },
    { time: "20:00", records: 1600 }
  ];

  const entityData = [
    { name: "Customers", records: 15420 },
    { name: "Products", records: 2340 },
    { name: "Transactions", records: 45230 },
    { name: "Events", records: 128450 }
  ];

  const activityLogs = [
    {
      id: 1,
      timestamp: "2024-03-15 14:30:25",
      level: "INFO",
      source: "FileProcessor",
      event: "FILE_UPLOADED",
      message: "customers_q1_2024.csv processed successfully (15,420 records)"
    },
    {
      id: 2,
      timestamp: "2024-03-15 14:28:12", 
      level: "WARNING",
      source: "ValidationService",
      event: "VALIDATION_ISSUES",
      message: "Found 23 validation errors in transaction data"
    },
    {
      id: 3,
      timestamp: "2024-03-15 14:25:45",
      level: "ERROR",
      source: "LLMService", 
      event: "API_TIMEOUT",
      message: "LLM mapping request timed out after 30 seconds"
    },
    {
      id: 4,
      timestamp: "2024-03-15 14:22:33",
      level: "INFO",
      source: "MappingService",
      event: "RELATIONSHIP_DISCOVERED", 
      message: "Auto-discovered 5 new relationships with 92% confidence"
    }
  ];

  const getLevelBadge = (level: string) => {
    const variants = {
      INFO: "bg-blue-100 text-blue-800",
      WARNING: "bg-yellow-100 text-yellow-800", 
      ERROR: "bg-red-100 text-red-800",
      DEBUG: "bg-gray-100 text-gray-800"
    };
    return <Badge className={variants[level as keyof typeof variants]}>{level}</Badge>;
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Activity className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Monitoring Dashboard</h1>
            <p className="text-muted-foreground">Real-time metrics and system logs</p>
          </div>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {metric.trend === "up" ? (
                        <ArrowUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={`text-xs ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div className="w-16 h-12">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metric.sparkline.map((value, i) => ({ value, index: i }))}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={metric.trend === "up" ? "#10b981" : "#ef4444"}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="logs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="logs">Activity Log</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Activity Log</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Auto-scroll</span>
                      <Switch defaultChecked />
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search logs..." className="pl-10" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg text-sm">
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {log.timestamp}
                      </div>
                      <div className="flex-shrink-0">
                        {getLevelBadge(log.level)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{log.source}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{log.event}</span>
                        </div>
                        <p className="text-muted-foreground">{log.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Select defaultValue="24h">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="6h">6 Hours</SelectItem>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Processing Throughput</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={throughputData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="records" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Records by Entity Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={entityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="records" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MonitoringDashboard;