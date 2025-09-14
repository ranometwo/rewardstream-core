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
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">{summary.mapped}</div>
              <div className="text-sm text-muted-foreground">Fields Mapped</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-green-500" />
            <div>
              <div className="text-2xl font-bold">{summary.relations}</div>
              <div className="text-sm text-muted-foreground">Relations</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-500" />
            <div>
              <div className="text-2xl font-bold">{summary.hasPK ? '1' : '0'}</div>
              <div className="text-sm text-muted-foreground">Primary Key</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-orange-500" />
            <div>
              <div className="text-2xl font-bold">{profiledData.columns.length - summary.mapped}</div>
              <div className="text-sm text-muted-foreground">Attributes</div>
            </div>
          </div>
        </Card>
      </div>

      {/* View Toggle */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as 'table' | 'graph')}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Table View
            </TabsTrigger>
            <TabsTrigger value="graph" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              Graph View
            </TabsTrigger>
          </TabsList>
          
          <Button variant="outline" onClick={generateSuggestions}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Re-analyze
          </Button>
        </div>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Column Mappings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source Column</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Target Relation</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Coverage</TableHead>
                      <TableHead>Transforms</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mappings.map((mapping) => (
                      <TableRow key={mapping.sourceColumn}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {mapping.sourceColumn}
                            {mapping.isManualOverride && (
                              <Badge variant="outline" className="text-xs">Manual</Badge>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Select 
                            value={mapping.suggestedType}
                            onValueChange={(value) => updateMapping(mapping.sourceColumn, { suggestedType: value })}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="string">String</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="boolean">Boolean</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        
                        <TableCell>
                          <Select 
                            value={mapping.role}
                            onValueChange={(value) => updateMapping(mapping.sourceColumn, { role: value as any })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="primary_key">
                                <div className="flex items-center gap-2">
                                  <Key className="w-4 h-4" />
                                  Primary Key
                                </div>
                              </SelectItem>
                              <SelectItem value="foreign_key">
                                <div className="flex items-center gap-2">
                                  <Link2 className="w-4 h-4" />
                                  Foreign Key
                                </div>
                              </SelectItem>
                              <SelectItem value="attribute">
                                <div className="flex items-center gap-2">
                                  <Type className="w-4 h-4" />
                                  Attribute
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        
                        <TableCell>
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
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Select target..." />
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
                        </TableCell>
                        
                        <TableCell>
                          <Badge className={getConfidenceColor(mapping.confidence)}>
                            {getConfidenceLabel(mapping.confidence)} ({Math.round(mapping.confidence * 100)}%)
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          {mapping.coverage && (
                            <Badge className={getCoverageColor(mapping.coverage)}>
                              {mapping.coverage}%
                            </Badge>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex gap-1">
                            {['trim', 'uppercase', 'lowercase'].map(transform => (
                              <div key={transform} className="flex items-center space-x-1">
                                <Switch
                                  checked={mapping.transforms.includes(transform)}
                                  onCheckedChange={(checked) => {
                                    const newTransforms = checked 
                                      ? [...mapping.transforms, transform]
                                      : mapping.transforms.filter(t => t !== transform);
                                    updateMapping(mapping.sourceColumn, { transforms: newTransforms });
                                  }}
                                  className="scale-75"
                                />
                                <Label className="text-xs capitalize">{transform}</Label>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Button variant="ghost">
                            <HelpCircle className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graph">
          <RelationshipGraph 
            mappings={mappings}
            availableDatasets={availableDatasets}
            onMappingUpdate={updateMapping}
          />
        </TabsContent>
      </Tabs>

      {/* Mapping Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Mapping Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>{summary.mapped} fields mapped</span>
              <span>{summary.relations} relations</span>
              <span>PK {summary.hasPK ? 'set' : 'not set'}</span>
            </div>
            
            {!summary.hasPK && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No primary key selected. This may impact data quality and relationships.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="text-sm text-muted-foreground">
              Ready to proceed with validation. {mappings.filter(m => m.confidence < 0.6).length} mappings have low confidence and may need review.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};