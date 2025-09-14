import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, EyeOff, RefreshCw, BarChart3, Hash, Calendar, Type } from "lucide-react";

interface ColumnProfile {
  name: string;
  index: number;
  suggestedType: 'string' | 'number' | 'date' | 'boolean';
  confidence: 'high' | 'medium' | 'low';
  nullPercentage: number;
  distinctCount: number;
  sampleValues: string[];
  patterns: {
    hasEmail: boolean;
    hasPhone: boolean;
    hasId: boolean;
    dateFormat?: string;
  };
}

interface DataPreviewProps {
  file: File | null;
  delimiter: string;
  onProfileComplete: (profiledData: {
    columns: ColumnProfile[];
    sampleRows: string[][];
    totalRows: number;
  }) => void;
}

export const DataPreview = ({ file, delimiter, onProfileComplete }: DataPreviewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [columns, setColumns] = useState<ColumnProfile[]>([]);
  const [sampleRows, setSampleRows] = useState<string[][]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [maskedColumns, setMaskedColumns] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (file) {
      profileData();
    }
  }, [file, delimiter]);

  const profileData = async () => {
    if (!file) return;

    setIsLoading(true);
    setProgress(0);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"(.*)"$/, '$1'));
      
      setProgress(25);
      
      // Parse sample of data
      const dataRows = lines.slice(1, Math.min(501, lines.length)).map(line => 
        line.split(delimiter).map(cell => cell.trim().replace(/^"(.*)"$/, '$1'))
      );
      
      setProgress(50);
      
      // Profile each column
      const profiledColumns: ColumnProfile[] = headers.map((header, index) => {
        const columnValues = dataRows.map(row => row[index]).filter(val => val && val.trim());
        const uniqueValues = new Set(columnValues);
        
        // Type detection
        const suggestedType = detectColumnType(columnValues);
        const confidence = calculateConfidence(columnValues, suggestedType);
        
        // Pattern detection
        const patterns = detectPatterns(columnValues, header);
        
        return {
          name: header,
          index,
          suggestedType,
          confidence,
          nullPercentage: ((dataRows.length - columnValues.length) / dataRows.length) * 100,
          distinctCount: uniqueValues.size,
          sampleValues: Array.from(uniqueValues).slice(0, 5),
          patterns
        };
      });
      
      setProgress(75);
      
      // Auto-mask PII columns
      const piiColumns = new Set(
        profiledColumns
          .filter(col => col.patterns.hasEmail || col.patterns.hasPhone || col.name.toLowerCase().includes('email') || col.name.toLowerCase().includes('phone'))
          .map(col => col.name)
      );
      
      setColumns(profiledColumns);
      setSampleRows(dataRows.slice(0, 20));
      setTotalRows(lines.length - 1);
      setMaskedColumns(piiColumns);
      setProgress(100);
      
      // Complete profiling
      onProfileComplete({
        columns: profiledColumns,
        sampleRows: dataRows,
        totalRows: lines.length - 1
      });
      
    } catch (error) {
      console.error('Error profiling data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const detectColumnType = (values: string[]): 'string' | 'number' | 'date' | 'boolean' => {
    if (values.length === 0) return 'string';
    
    const sample = values.slice(0, 100); // Sample for performance
    
    // Check for boolean
    const booleanPattern = /^(true|false|yes|no|y|n|0|1)$/i;
    if (sample.every(val => booleanPattern.test(val.trim()))) {
      return 'boolean';
    }
    
    // Check for numbers
    const numberCount = sample.filter(val => !isNaN(Number(val.trim())) && val.trim() !== '').length;
    if (numberCount > sample.length * 0.8) {
      return 'number';
    }
    
    // Check for dates (strict format validation)
    const datePattern1 = /^\d{1,2}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{4}$/i;
    const datePattern2 = /^\d{4}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{1,2}$/i;
    
    const dateCount = sample.filter(val => 
      datePattern1.test(val.trim()) || datePattern2.test(val.trim())
    ).length;
    
    if (dateCount > sample.length * 0.7) {
      return 'date';
    }
    
    return 'string';
  };

  const calculateConfidence = (values: string[], type: string): 'high' | 'medium' | 'low' => {
    if (values.length < 5) return 'low';
    
    const sample = values.slice(0, 100);
    let matches = 0;
    
    switch (type) {
      case 'number':
        matches = sample.filter(val => !isNaN(Number(val.trim())) && val.trim() !== '').length;
        break;
      case 'date':
        const datePattern1 = /^\d{1,2}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{4}$/i;
        const datePattern2 = /^\d{4}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{1,2}$/i;
        matches = sample.filter(val => datePattern1.test(val.trim()) || datePattern2.test(val.trim())).length;
        break;
      case 'boolean':
        const booleanPattern = /^(true|false|yes|no|y|n|0|1)$/i;
        matches = sample.filter(val => booleanPattern.test(val.trim())).length;
        break;
      default:
        return 'high'; // String is default
    }
    
    const ratio = matches / sample.length;
    if (ratio > 0.9) return 'high';
    if (ratio > 0.7) return 'medium';
    return 'low';
  };

  const detectPatterns = (values: string[], columnName: string) => {
    const sample = values.slice(0, 100);
    
    return {
      hasEmail: sample.some(val => /\S+@\S+\.\S+/.test(val)),
      hasPhone: sample.some(val => /[\d\s\-\+\(\)]{10,}/.test(val)),
      hasId: columnName.toLowerCase().includes('id') || sample.every(val => /^\d+$/.test(val.trim())),
      dateFormat: values.some(val => /^\d{1,2}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{4}$/i.test(val.trim())) ? 'dd-mmm-yyyy' :
                 values.some(val => /^\d{4}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{1,2}$/i.test(val.trim())) ? 'yyyy-mmm-dd' : undefined
    };
  };

  const toggleMask = (columnName: string) => {
    setMaskedColumns(prev => {
      const newMasked = new Set(prev);
      if (newMasked.has(columnName)) {
        newMasked.delete(columnName);
      } else {
        newMasked.add(columnName);
      }
      return newMasked;
    });
  };

  const maskValue = (value: string) => {
    if (value.length <= 4) return '***';
    return value.substring(0, 2) + '*'.repeat(value.length - 4) + value.substring(value.length - 2);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'number': return <Hash className="w-4 h-4" />;
      case 'date': return <Calendar className="w-4 h-4" />;
      case 'boolean': return <BarChart3 className="w-4 h-4" />;
      default: return <Type className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="mb-4">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Profiling Data</h3>
          <p className="text-muted-foreground">Analyzing column types and patterns...</p>
        </div>
        <Progress value={progress} className="w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{totalRows.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Rows</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{columns.length}</div>
                <div className="text-sm text-muted-foreground">Columns</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{maskedColumns.size}</div>
                <div className="text-sm text-muted-foreground">PII Columns</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Column Profiling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Column Analysis
            <Button variant="outline" onClick={profileData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Re-analyze
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Null %</TableHead>
                  <TableHead>Distinct</TableHead>
                  <TableHead>Sample Values</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {columns.map((column) => (
                  <TableRow key={column.name}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {column.name}
                        {(column.patterns.hasEmail || column.patterns.hasPhone) && (
                          <Badge variant="outline" className="text-xs">PII</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(column.suggestedType)}
                        <span className="capitalize">{column.suggestedType}</span>
                        {column.patterns.dateFormat && (
                          <Badge variant="outline" className="text-xs">
                            {column.patterns.dateFormat}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getConfidenceColor(column.confidence)}>
                        {column.confidence}
                      </Badge>
                    </TableCell>
                    <TableCell>{column.nullPercentage.toFixed(1)}%</TableCell>
                    <TableCell>{column.distinctCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {column.sampleValues.slice(0, 3).map((value, idx) => (
                          <div key={idx} className="text-sm text-muted-foreground truncate">
                            {maskedColumns.has(column.name) ? maskValue(value) : value}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() => toggleMask(column.name)}
                      >
                        {maskedColumns.has(column.name) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Sample Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Data (First 20 rows)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.name} className="min-w-[120px]">
                      {column.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleRows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => {
                      const column = columns[cellIndex];
                      const shouldMask = column && maskedColumns.has(column.name);
                      return (
                        <TableCell key={cellIndex} className="font-mono text-sm">
                          {shouldMask ? maskValue(cell) : cell}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* PII Notice */}
      {maskedColumns.size > 0 && (
        <Alert>
          <EyeOff className="h-4 w-4" />
          <AlertDescription>
            {maskedColumns.size} column(s) contain potentially sensitive information and are masked by default. 
            Click the eye icon to reveal data if you have appropriate permissions.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};