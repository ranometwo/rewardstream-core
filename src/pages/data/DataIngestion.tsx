import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Download, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DataIngestion = () => {
  const uploadHistory = [
    {
      id: 1,
      filename: "customers_q1_2024.csv",
      timestamp: "2024-03-15 14:30",
      size: "2.4 MB",
      rowCount: 15420,
      status: "completed"
    },
    {
      id: 2,
      filename: "transactions_march.xlsx",
      timestamp: "2024-03-14 09:15",
      size: "8.7 MB", 
      rowCount: 45230,
      status: "completed"
    }
  ];

  const previewData = {
    filename: "customers_q1_2024.csv",
    totalRows: 15420,
    totalColumns: 8,
    fileSize: "2.4 MB",
    columns: [
      { name: "customer_id", type: "Identifier", sample: ["CUST001", "CUST002", "CUST003"] },
      { name: "email", type: "String", sample: ["john@email.com", "jane@email.com", "bob@email.com"] },
      { name: "phone", type: "String", sample: ["+1234567890", "+1987654321", "+1122334455"] },
      { name: "signup_date", type: "Date", sample: ["2024-01-15", "2024-01-20", "2024-02-01"] },
      { name: "age", type: "Number", sample: ["28", "34", "42"] },
      { name: "is_premium", type: "Boolean", sample: ["true", "false", "true"] },
      { name: "total_spent", type: "Number", sample: ["1250.50", "890.25", "2340.75"] },
      { name: "tier", type: "String", sample: ["Gold", "Silver", "Platinum"] }
    ]
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Upload className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Data Ingestion</h1>
            <p className="text-muted-foreground">Upload and preview CSV and Excel files</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-200px)]">
          {/* Upload Section */}
          <div className="space-y-4">
            <Card className="h-[300px]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Upload Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center h-[200px] flex flex-col items-center justify-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-sm font-medium mb-2">Drop CSV or Excel files here</p>
                  <p className="text-xs text-muted-foreground mb-4">Max file size: 100MB</p>
                  <Button size="sm">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Browse Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Upload History</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Sample Files
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadHistory.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.timestamp} • {file.size} • {file.rowCount.toLocaleString()} rows
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {file.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Data Preview</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {previewData.filename} • {previewData.totalRows.toLocaleString()} rows • {previewData.totalColumns} columns • {previewData.fileSize}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-xs text-muted-foreground">
                  Displaying first 100 of {previewData.totalRows.toLocaleString()} rows
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-4 gap-0 text-xs font-medium bg-muted/50">
                    {previewData.columns.slice(0, 4).map((col) => (
                      <div key={col.name} className="p-2 border-r last:border-r-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="truncate">{col.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {col.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {[0, 1, 2].map((rowIndex) => (
                      <div key={rowIndex} className="grid grid-cols-4 gap-0 text-xs border-t">
                        {previewData.columns.slice(0, 4).map((col, colIndex) => (
                          <div key={colIndex} className="p-2 border-r last:border-r-0">
                            {col.sample[rowIndex]}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="outline">Cancel</Button>
                  <Button>
                    Proceed to Mapping
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DataIngestion;