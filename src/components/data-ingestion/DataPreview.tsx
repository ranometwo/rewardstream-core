import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
    <div className="space-y-3">
      {/* Inline Summary Stats */}
      <div className="flex items-center gap-4 p-2 bg-muted/30 rounded-md text-sm">
        <div className="flex items-center gap-1">
          <Hash className="w-3 h-3" />
          <span className="font-medium">{totalRows.toLocaleString()}</span>
          <span className="text-muted-foreground">rows</span>
        </div>
        <div className="flex items-center gap-1">
          <BarChart3 className="w-3 h-3" />
          <span className="font-medium">{columns.length}</span>
          <span className="text-muted-foreground">cols</span>
        </div>
        <div className="flex items-center gap-1">
          <EyeOff className="w-3 h-3" />
          <span className="font-medium">{maskedColumns.size}</span>
          <span className="text-muted-foreground">PII</span>
        </div>
        <div className="ml-auto">
          <Button variant="outline" onClick={profileData} className="h-6 text-xs">
            <RefreshCw className="w-3 h-3 mr-1" />
            Re-analyze
          </Button>
        </div>
      </div>

      {/* Compact Column Analysis */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-muted/50 px-2 py-1 border-b">
          <Label className="text-sm font-medium">Column Analysis</Label>
        </div>
        <div className="overflow-x-auto max-h-64">
          <table className="w-full text-xs">
            <thead className="bg-muted/30 sticky top-0">
              <tr>
                <th className="text-left p-1 font-medium">Column</th>
                <th className="text-left p-1 font-medium">Type</th>
                <th className="text-left p-1 font-medium">Conf</th>
                <th className="text-left p-1 font-medium">Null%</th>
                <th className="text-left p-1 font-medium">Distinct</th>
                <th className="text-left p-1 font-medium">Samples</th>
                <th className="text-left p-1 font-medium w-8"></th>
              </tr>
            </thead>
            <tbody>
              {columns.map((column) => (
                <tr key={column.name} className="border-t hover:bg-muted/20">
                  <td className="p-1">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{column.name}</span>
                      {(column.patterns.hasEmail || column.patterns.hasPhone) && (
                        <Badge variant="outline" className="text-xs px-1 py-0">PII</Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-1">
                    <div className="flex items-center gap-1">
                      {getTypeIcon(column.suggestedType)}
                      <span>{column.suggestedType}</span>
                      {column.patterns.dateFormat && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {column.patterns.dateFormat}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-1">
                    <Badge className={`${getConfidenceColor(column.confidence)} text-xs px-1 py-0`}>
                      {column.confidence[0].toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-1 text-muted-foreground">{column.nullPercentage.toFixed(1)}%</td>
                  <td className="p-1 text-muted-foreground">{column.distinctCount.toLocaleString()}</td>
                  <td className="p-1">
                    <div className="max-w-24 text-muted-foreground">
                      {column.sampleValues.slice(0, 2).map((value, idx) => (
                        <div key={idx} className="truncate text-xs">
                          {maskedColumns.has(column.name) ? maskValue(value) : value}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-1">
                    <Button
                      variant="ghost"
                      onClick={() => toggleMask(column.name)}
                      className="h-5 w-5 p-0"
                    >
                      {maskedColumns.has(column.name) ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compact Sample Data */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-muted/50 px-2 py-1 border-b flex items-center justify-between">
          <Label className="text-sm font-medium">Sample Data</Label>
          <Badge variant="outline" className="text-xs">20 rows</Badge>
        </div>
        <div className="overflow-auto max-h-40">
          <table className="w-full text-xs">
            <thead className="bg-muted/30 sticky top-0">
              <tr>
                {columns.map((column) => (
                  <th key={column.name} className="text-left p-1 font-medium min-w-[60px]">
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t hover:bg-muted/20">
                  {row.map((cell, cellIndex) => {
                    const column = columns[cellIndex];
                    const shouldMask = column && maskedColumns.has(column.name);
                    return (
                      <td key={cellIndex} className="p-1 font-mono text-muted-foreground">
                        <div className="max-w-20 truncate">
                          {shouldMask ? maskValue(cell) : cell}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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