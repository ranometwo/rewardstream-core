import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Key, 
  Type, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  RotateCcw,
  Eye,
  Layers
} from "lucide-react";

interface ColumnMapping {
  sourceColumn: string;
  targetColumn: string;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'json';
  isPrimaryKey: boolean;
  nullable: boolean;
  transforms: string[];
  confidence: number;
}

interface SchemaMappingProps {
  file: File | null;
  onMappingComplete: (mappings: ColumnMapping[]) => void;
}

export const SchemaMapping = ({ file, onMappingComplete }: SchemaMappingProps) => {
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [previewData, setPreviewData] = useState<any[]>([]);

  useEffect(() => {
    if (file) {
      analyzeSchema();
    }
  }, [file]);

  const analyzeSchema = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate progressive analysis
    const progressSteps = [
      { progress: 20, message: 'Reading file headers...' },
      { progress: 40, message: 'Sampling data...' },
      { progress: 60, message: 'Detecting data types...' },
      { progress: 80, message: 'Generating mappings...' },
      { progress: 100, message: 'Analysis complete' }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(step.progress);
    }

    // Mock analysis results
    const mockColumns = ['customer_id', 'email', 'first_name', 'last_name', 'created_date', 'total_orders', 'is_premium'];
    const mockMappings: ColumnMapping[] = mockColumns.map(column => ({
      sourceColumn: column,
      targetColumn: column.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      dataType: getDataType(column),
      isPrimaryKey: column === 'customer_id',
      nullable: !['customer_id', 'email'].includes(column),
      transforms: getDefaultTransforms(column),
      confidence: Math.random() * 0.4 + 0.6 // 0.6 to 1.0
    }));

    // Mock preview data
    const mockPreview = [
      { customer_id: 'CUST_001', email: 'john@example.com', first_name: 'John', last_name: 'Doe', created_date: '2024-01-15', total_orders: 5, is_premium: true },
      { customer_id: 'CUST_002', email: 'jane@example.com', first_name: 'Jane', last_name: 'Smith', created_date: '2024-02-01', total_orders: 12, is_premium: false },
      { customer_id: 'CUST_003', email: 'bob@example.com', first_name: 'Bob', last_name: 'Johnson', created_date: '2024-01-30', total_orders: 8, is_premium: true }
    ];

    setMappings(mockMappings);
    setPreviewData(mockPreview);
    setIsAnalyzing(false);
    onMappingComplete(mockMappings);
  };

  const getDataType = (column: string): ColumnMapping['dataType'] => {
    if (column.includes('id')) return 'string';
    if (column.includes('date') || column.includes('time')) return 'date';
    if (column.includes('count') || column.includes('total') || column.includes('amount')) return 'number';
    if (column.includes('is_') || column.includes('has_')) return 'boolean';
    return 'string';
  };

  const getDefaultTransforms = (column: string): string[] => {
    const transforms = [];
    if (column.includes('email')) transforms.push('lowercase', 'trim');
    if (column.includes('name')) transforms.push('trim', 'title_case');
    if (column.includes('id')) transforms.push('uppercase', 'trim');
    return transforms;
  };

  const updateMapping = (index: number, updates: Partial<ColumnMapping>) => {
    const newMappings = [...mappings];
    newMappings[index] = { ...newMappings[index], ...updates };
    
    // Ensure only one primary key
    if (updates.isPrimaryKey) {
      newMappings.forEach((mapping, i) => {
        if (i !== index) mapping.isPrimaryKey = false;
      });
    }
    
    setMappings(newMappings);
    onMappingComplete(newMappings);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-success/10 text-success border-success/20';
    if (confidence >= 0.7) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-destructive/10 text-destructive border-destructive/20';
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div className="absolute -inset-2 rounded-full border border-primary/20 animate-ping" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">Analyzing Schema</h3>
          <p className="text-muted-foreground">AI is examining your data structure and suggesting optimal mappings...</p>
        </div>
        
        <Progress value={analysisProgress} className="w-80" />
        <p className="text-sm text-muted-foreground">{analysisProgress}% complete</p>
      </div>
    );
  }

  if (!file || mappings.length === 0) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please upload a data file in the previous step to begin schema analysis.
        </AlertDescription>
      </Alert>
    );
  }

  const primaryKeySet = mappings.some(m => m.isPrimaryKey);
  const highConfidenceCount = mappings.filter(m => m.confidence >= 0.9).length;

  return (
    <div className="space-y-6">
      {/* Analysis Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">{mappings.length}</div>
              <div className="text-sm text-muted-foreground">Columns</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-500" />
            <div>
              <div className="text-2xl font-bold">{primaryKeySet ? '1' : '0'}</div>
              <div className="text-sm text-muted-foreground">Primary Key</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <div>
              <div className="text-2xl font-bold">{highConfidenceCount}</div>
              <div className="text-sm text-muted-foreground">High Confidence</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            <div>
              <div className="text-2xl font-bold">{mappings.filter(m => m.transforms.length > 0).length}</div>
              <div className="text-sm text-muted-foreground">Transforms</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Schema Mapping Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            Column Mappings
          </CardTitle>
          <Button variant="outline" onClick={analyzeSchema} className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Re-analyze
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source Column</TableHead>
                  <TableHead>Target Column</TableHead>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Primary Key</TableHead>
                  <TableHead>Nullable</TableHead>
                  <TableHead>Transforms</TableHead>
                  <TableHead>Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.map((mapping, index) => (
                  <TableRow key={mapping.sourceColumn}>
                    <TableCell className="font-mono font-medium">
                      {mapping.sourceColumn}
                    </TableCell>
                    
                    <TableCell>
                      <input
                        type="text"
                        value={mapping.targetColumn}
                        onChange={(e) => updateMapping(index, { targetColumn: e.target.value })}
                        className="w-full p-1 border rounded font-mono text-sm"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Select 
                        value={mapping.dataType}
                        onValueChange={(value) => updateMapping(index, { dataType: value as any })}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    
                    <TableCell>
                      <Switch
                        checked={mapping.isPrimaryKey}
                        onCheckedChange={(checked) => updateMapping(index, { isPrimaryKey: checked })}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Switch
                        checked={mapping.nullable}
                        onCheckedChange={(checked) => updateMapping(index, { nullable: checked })}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-32">
                        {['trim', 'lowercase', 'uppercase', 'title_case'].map(transform => (
                          <Badge 
                            key={transform}
                            variant={mapping.transforms.includes(transform) ? 'default' : 'outline'}
                            className="text-xs cursor-pointer"
                            onClick={() => {
                              const newTransforms = mapping.transforms.includes(transform)
                                ? mapping.transforms.filter(t => t !== transform)
                                : [...mapping.transforms, transform];
                              updateMapping(index, { transforms: newTransforms });
                            }}
                          >
                            {transform.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getConfidenceColor(mapping.confidence)}>
                        {Math.round(mapping.confidence * 100)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Data Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {mappings.slice(0, 6).map(mapping => (
                    <TableHead key={mapping.sourceColumn} className="font-mono text-xs">
                      {mapping.sourceColumn}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.slice(0, 3).map((row, index) => (
                  <TableRow key={index}>
                    {mappings.slice(0, 6).map(mapping => (
                      <TableCell key={mapping.sourceColumn} className="font-mono text-xs">
                        {String(row[mapping.sourceColumn])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {mappings.length > 6 && (
            <p className="text-xs text-muted-foreground mt-2">
              Showing first 6 columns. Full dataset contains {mappings.length} columns.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Validation Alerts */}
      {!primaryKeySet && (
        <Alert className="bg-warning/10 border-warning/20">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning-foreground">
            No primary key defined. Consider setting a primary key for better data integrity and performance.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};