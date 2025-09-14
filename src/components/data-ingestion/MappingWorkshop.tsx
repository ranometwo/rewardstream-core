import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Key, 
  Link2, 
  Type, 
  Zap, 
  Target, 
  Network, 
  CheckCircle, 
  AlertTriangle,
  HelpCircle,
  Sparkles,
  RotateCcw
} from "lucide-react";
import { RelationshipGraph } from "./RelationshipGraph";

interface ColumnMapping {
  sourceColumn: string;
  role: 'primary_key' | 'foreign_key' | 'attribute';
  targetDataset?: string;
  targetColumn?: string;
  confidence: number;
  coverage?: number;
  transforms: string[];
  isManualOverride: boolean;
  suggestedType: string;
}

interface MappingWorkshopProps {
  profiledData: {
    columns: Array<{
      name: string;
      suggestedType: string;
      confidence: string;
      nullPercentage: number;
      distinctCount: number;
      sampleValues: string[];
      patterns: any;
    }>;
    sampleRows: string[][];
    totalRows: number;
  } | null;
  onMappingComplete: (mappings: ColumnMapping[]) => void;
}

export const MappingWorkshop = ({ profiledData, onMappingComplete }: MappingWorkshopProps) => {
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [activeView, setActiveView] = useState<'table' | 'graph'>('table');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [availableDatasets] = useState([
    { id: 'users', name: 'Users Dataset', columns: ['user_id', 'email', 'name', 'created_at'] },
    { id: 'products', name: 'Products Dataset', columns: ['sku', 'name', 'price', 'category'] },
    { id: 'events', name: 'Events Dataset', columns: ['event_id', 'user_id', 'event_type', 'timestamp'] }
  ]);

  useEffect(() => {
    if (profiledData) {
      generateSuggestions();
    }
  }, [profiledData]);

  const generateSuggestions = async () => {
    if (!profiledData) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI-powered mapping suggestions
    const suggestions: ColumnMapping[] = profiledData.columns.map(column => {
      let role: 'primary_key' | 'foreign_key' | 'attribute' = 'attribute';
      let confidence = 0.5;
      let targetDataset = '';
      let targetColumn = '';
      let coverage = 0;
      
      // Primary Key Detection
      if (
        column.name.toLowerCase().includes('id') && 
        column.nullPercentage === 0 &&
        column.distinctCount === profiledData.totalRows
      ) {
        role = 'primary_key';
        confidence = 0.95;
      }
      // Foreign Key Detection
      else if (column.name.toLowerCase().includes('user_id')) {
        role = 'foreign_key';
        targetDataset = 'users';
        targetColumn = 'user_id';
        confidence = 0.87;
        coverage = 92; // Simulated coverage
      }
      else if (column.name.toLowerCase().includes('sku')) {
        role = 'foreign_key';
        targetDataset = 'products';
        targetColumn = 'sku';
        confidence = 0.78;
        coverage = 85;
      }
      else if (column.name.toLowerCase().includes('event_id')) {
        role = 'foreign_key';
        targetDataset = 'events';
        targetColumn = 'event_id';
        confidence = 0.82;
        coverage = 88;
      }
      
      // Auto-detect transforms needed
      const transforms: string[] = [];
      if (column.sampleValues.some(val => val !== val.trim())) {
        transforms.push('trim');
      }
      if (column.name.toLowerCase().includes('id') && column.sampleValues.some(val => val.toLowerCase() !== val)) {
        transforms.push('uppercase');
      }
      
      return {
        sourceColumn: column.name,
        role,
        targetDataset,
        targetColumn,
        confidence,
        coverage,
        transforms,
        isManualOverride: false,
        suggestedType: column.suggestedType
      };
    });
    
    setMappings(suggestions);
    onMappingComplete(suggestions);
    setIsAnalyzing(false);
  };

  const updateMapping = (sourceColumn: string, updates: Partial<ColumnMapping>) => {
    setMappings(prev => {
      const newMappings = prev.map(mapping => 
        mapping.sourceColumn === sourceColumn 
          ? { ...mapping, ...updates, isManualOverride: true }
          : mapping
      );
      onMappingComplete(newMappings);
      return newMappings;
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const getCoverageColor = (coverage: number | undefined) => {
    if (!coverage) return 'bg-gray-100 text-gray-800';
    if (coverage >= 95) return 'bg-green-100 text-green-800';
    if (coverage >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getMappingSummary = () => {
    const mapped = mappings.filter(m => m.role !== 'attribute').length;
    const relations = mappings.filter(m => m.role === 'foreign_key').length;
    const hasPK = mappings.some(m => m.role === 'primary_key');
    
    return { mapped, relations, hasPK };
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-4">
          <Sparkles className="w-8 h-8 animate-pulse text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">Analyzing Relationships</h3>
        <p className="text-muted-foreground mb-4">AI is suggesting optimal mappings...</p>
        <Progress value={75} className="w-64" />
      </div>
    );
  }

  if (!profiledData) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No profiled data available. Please complete the data preview step first.
        </AlertDescription>
      </Alert>
    );
  }

  const summary = getMappingSummary();

  return (
    <div className="space-y-3">
      {/* Inline Summary Stats */}
      <div className="flex items-center gap-4 p-2 bg-muted/30 rounded-md text-sm">
        <div className="flex items-center gap-1">
          <Target className="w-3 h-3 text-blue-500" />
          <span className="font-medium">{summary.mapped}</span>
          <span className="text-muted-foreground">mapped</span>
        </div>
        <div className="flex items-center gap-1">
          <Link2 className="w-3 h-3 text-green-500" />
          <span className="font-medium">{summary.relations}</span>
          <span className="text-muted-foreground">relations</span>
        </div>
        <div className="flex items-center gap-1">
          <Key className="w-3 h-3 text-purple-500" />
          <span className="font-medium">{summary.hasPK ? '1' : '0'}</span>
          <span className="text-muted-foreground">PK</span>
        </div>
        <div className="flex items-center gap-1">
          <Type className="w-3 h-3 text-orange-500" />
          <span className="font-medium">{profiledData.columns.length - summary.mapped}</span>
          <span className="text-muted-foreground">attrs</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={generateSuggestions} className="h-6 text-xs">
            <RotateCcw className="w-3 h-3 mr-1" />
            Re-analyze
          </Button>
          <div className="flex">
            <Button 
              variant={activeView === 'table' ? 'default' : 'outline'}
              onClick={() => setActiveView('table')}
              className="h-6 px-2 text-xs rounded-r-none"
            >
              <Type className="w-3 h-3" />
            </Button>
            <Button 
              variant={activeView === 'graph' ? 'default' : 'outline'}
              onClick={() => setActiveView('graph')}
              className="h-6 px-2 text-xs rounded-l-none"
            >
              <Network className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Conditional Content Based on Active View */}
      {activeView === 'table' && (
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted/50 px-2 py-1 border-b">
            <Label className="text-sm font-medium">Column Mappings</Label>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-xs">
              <thead className="bg-muted/30 sticky top-0">
                <tr>
                  <th className="text-left p-1 font-medium">Column</th>
                  <th className="text-left p-1 font-medium">Type</th>
                  <th className="text-left p-1 font-medium">Role</th>
                  <th className="text-left p-1 font-medium">Target</th>
                  <th className="text-left p-1 font-medium">Conf</th>
                  <th className="text-left p-1 font-medium">Cov</th>
                  <th className="text-left p-1 font-medium">Transforms</th>
                </tr>
              </thead>
              <tbody>
                {mappings.map((mapping) => (
                  <tr key={mapping.sourceColumn} className="border-t hover:bg-muted/20">
                    <td className="p-1">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{mapping.sourceColumn}</span>
                        {mapping.isManualOverride && (
                          <Badge variant="outline" className="text-xs px-1 py-0">M</Badge>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-1">
                      <Select 
                        value={mapping.suggestedType}
                        onValueChange={(value) => updateMapping(mapping.sourceColumn, { suggestedType: value })}
                      >
                        <SelectTrigger className="h-5 w-16 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">Str</SelectItem>
                          <SelectItem value="number">Num</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="boolean">Bool</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    
                    <td className="p-1">
                      <Select 
                        value={mapping.role}
                        onValueChange={(value) => updateMapping(mapping.sourceColumn, { role: value as any })}
                      >
                        <SelectTrigger className="h-5 w-20 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary_key">
                            <div className="flex items-center gap-1">
                              <Key className="w-3 h-3" />
                              PK
                            </div>
                          </SelectItem>
                          <SelectItem value="foreign_key">
                            <div className="flex items-center gap-1">
                              <Link2 className="w-3 h-3" />
                              FK
                            </div>
                          </SelectItem>
                          <SelectItem value="attribute">
                            <div className="flex items-center gap-1">
                              <Type className="w-3 h-3" />
                              Attr
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    
                    <td className="p-1">
                      {mapping.role === 'foreign_key' && (
                        <Select 
                          value={`${mapping.targetDataset}.${mapping.targetColumn}`}
                          onValueChange={(value) => {
                            const [dataset, column] = value.split('.');
                            updateMapping(mapping.sourceColumn, { 
                              targetDataset: dataset, 
                              targetColumn: column 
                            });
                          }}
                        >
                          <SelectTrigger className="h-5 w-24 text-xs">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {availableDatasets.map(dataset => 
                              dataset.columns.map(column => (
                                <SelectItem key={`${dataset.id}.${column}`} value={`${dataset.id}.${column}`}>
                                  {dataset.name}.{column}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    </td>
                    
                    <td className="p-1">
                      <Badge className={`${getConfidenceColor(mapping.confidence)} text-xs px-1 py-0`}>
                        {getConfidenceLabel(mapping.confidence)[0]}{Math.round(mapping.confidence * 100)}%
                      </Badge>
                    </td>
                    
                    <td className="p-1">
                      {mapping.coverage && (
                        <Badge className={`${getCoverageColor(mapping.coverage)} text-xs px-1 py-0`}>
                          {mapping.coverage}%
                        </Badge>
                      )}
                    </td>
                    
                    <td className="p-1">
                      <div className="flex gap-1">
                        {['trim', 'upper', 'lower'].map(transform => (
                          <div key={transform} className="flex items-center">
                            <Switch
                              checked={mapping.transforms.includes(transform)}
                              onCheckedChange={(checked) => {
                                const newTransforms = checked 
                                  ? [...mapping.transforms, transform]
                                  : mapping.transforms.filter(t => t !== transform);
                                updateMapping(mapping.sourceColumn, { transforms: newTransforms });
                              }}
                              className="scale-50"
                            />
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'graph' && (
        <RelationshipGraph 
          mappings={mappings}
          availableDatasets={availableDatasets}
          onMappingUpdate={updateMapping}
        />
      )}

      {/* Compact Mapping Summary */}
      {!summary.hasPK && (
        <Alert className="p-2">
          <AlertTriangle className="h-3 w-3" />
          <AlertDescription className="text-xs">
            No primary key set. Consider designating a unique identifier column.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};