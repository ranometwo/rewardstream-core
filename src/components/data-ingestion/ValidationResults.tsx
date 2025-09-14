import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Download, 
  RefreshCw, 
  BarChart3,
  FileText 
} from "lucide-react";

interface ValidationIssue {
  row: number;
  column: string;
  rule: string;
  severity: 'error' | 'warning';
  description: string;
  sampleValue: string;
  fixSuggestion: string;
}

interface ValidationResultsProps {
  mappings: Array<{
    sourceColumn: string;
    role: 'primary_key' | 'foreign_key' | 'attribute';
    suggestedType: string;
  }>;
  file: File | null;
  onValidationComplete: (results: {
    passed: boolean;
    issues: ValidationIssue[];
    summary: {
      totalRows: number;
      errorCount: number;
      warningCount: number;
      passedRows: number;
    };
  }) => void;
}

export const ValidationResults = ({ mappings, file, onValidationComplete }: ValidationResultsProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    passed: boolean;
    issues: ValidationIssue[];
    summary: {
      totalRows: number;
      errorCount: number;
      warningCount: number;
      passedRows: number;
    };
  } | null>(null);

  useEffect(() => {
    if (mappings.length > 0 && file) {
      runValidation();
    }
  }, [mappings, file]);

  const runValidation = async () => {
    if (!file) return;

    setIsValidating(true);
    setProgress(0);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1'));
      const dataRows = lines.slice(1);

      setProgress(25);

      // Simulate validation process
      const issues: ValidationIssue[] = [];
      const primaryKeyColumn = mappings.find(m => m.role === 'primary_key');
      
      // Validate each row
      for (let i = 0; i < Math.min(dataRows.length, 100); i++) {
        const row = dataRows[i].split(',').map(cell => cell.trim().replace(/^"(.*)"$/, '$1'));
        
        // Check primary key uniqueness
        if (primaryKeyColumn) {
          const pkIndex = headers.indexOf(primaryKeyColumn.sourceColumn);
          const pkValue = row[pkIndex];
          
          if (!pkValue || pkValue.trim() === '') {
            issues.push({
              row: i + 2,
              column: primaryKeyColumn.sourceColumn,
              rule: 'primary_key',
              severity: 'error',
              description: 'Primary key cannot be null or empty',
              sampleValue: pkValue || '(empty)',
              fixSuggestion: 'Provide a unique identifier for this row'
            });
          }
        }

        // Validate date formats
        mappings.forEach(mapping => {
          if (mapping.suggestedType === 'date') {
            const colIndex = headers.indexOf(mapping.sourceColumn);
            const value = row[colIndex];
            
            if (value && value.trim()) {
              const datePattern1 = /^\d{1,2}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{4}$/i;
              const datePattern2 = /^\d{4}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{1,2}$/i;
              
              if (!datePattern1.test(value.trim()) && !datePattern2.test(value.trim())) {
                issues.push({
                  row: i + 2,
                  column: mapping.sourceColumn,
                  rule: 'date_format',
                  severity: 'error',
                  description: 'Date must be in dd-mmm-yyyy or yyyy-mmm-dd format',
                  sampleValue: value,
                  fixSuggestion: 'Convert to 14-Sep-2025 or 2025-Sep-14 format'
                });
              }
            }
          }
        });

        // Type validation
        mappings.forEach(mapping => {
          if (mapping.suggestedType === 'number') {
            const colIndex = headers.indexOf(mapping.sourceColumn);
            const value = row[colIndex];
            
            if (value && value.trim() && isNaN(Number(value.trim()))) {
              issues.push({
                row: i + 2,
                column: mapping.sourceColumn,
                rule: 'type_check',
                severity: 'warning',
                description: 'Value does not appear to be a valid number',
                sampleValue: value,
                fixSuggestion: 'Verify numeric format or change column type'
              });
            }
          }
        });

        setProgress(25 + (i / dataRows.length) * 50);
      }

      setProgress(75);

      // Generate summary
      const errorCount = issues.filter(i => i.severity === 'error').length;
      const warningCount = issues.filter(i => i.severity === 'warning').length;
      
      const validationResults = {
        passed: errorCount === 0,
        issues,
        summary: {
          totalRows: dataRows.length,
          errorCount,
          warningCount,
          passedRows: dataRows.length - new Set(issues.filter(i => i.severity === 'error').map(i => i.row)).size
        }
      };

      setResults(validationResults);
      onValidationComplete(validationResults);
      setProgress(100);

    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const downloadErrorReport = () => {
    if (!results) return;

    const csv = [
      ['Row', 'Column', 'Rule', 'Severity', 'Description', 'Sample Value', 'Fix Suggestion'].join(','),
      ...results.issues.map(issue => [
        issue.row,
        issue.column,
        issue.rule,
        issue.severity,
        `"${issue.description}"`,
        `"${issue.sampleValue}"`,
        `"${issue.fixSuggestion}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'validation-errors.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTopErrorReasons = () => {
    if (!results) return [];
    
    const reasonCounts: Record<string, number> = {};
    results.issues.forEach(issue => {
      reasonCounts[issue.rule] = (reasonCounts[issue.rule] || 0) + 1;
    });

    return Object.entries(reasonCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([rule, count]) => ({ rule, count }));
  };

  if (isValidating) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="mb-4">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Validating Data</h3>
          <p className="text-muted-foreground">Running validation checks...</p>
        </div>
        <Progress value={progress} className="w-full" />
      </div>
    );
  }

  if (!results) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No validation results available. Please ensure mappings are configured.
        </AlertDescription>
      </Alert>
    );
  }

  const topErrors = getTopErrorReasons();

  return (
    <div className="space-y-3">
      {/* Compact Validation Status */}
      <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
        <div className="flex items-center gap-3">
          {results.passed ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          <div className="text-sm font-medium">
            Validation {results.passed ? 'Passed' : 'Failed'}
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="font-medium">{results.summary.totalRows.toLocaleString()}</span>
            <span className="text-muted-foreground">total</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-green-600">{results.summary.passedRows.toLocaleString()}</span>
            <span className="text-muted-foreground">passed</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-red-600">{results.summary.errorCount}</span>
            <span className="text-muted-foreground">errors</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-yellow-600">{results.summary.warningCount}</span>
            <span className="text-muted-foreground">warnings</span>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" onClick={downloadErrorReport} className="h-5 px-2 text-xs">
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
            <Button variant="outline" onClick={runValidation} className="h-5 px-2 text-xs">
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          </div>
        </div>
      </div>

      {/* Compact Error Reasons */}
      {topErrors.length > 0 && (
        <div className="p-2 bg-muted/30 rounded-md">
          <Label className="text-sm font-medium mb-1 block">Top Issues:</Label>
          <div className="flex flex-wrap gap-2">
            {topErrors.map(({ rule, count }) => (
              <div key={rule} className="flex items-center gap-1">
                <Badge variant="destructive" className="text-xs px-1 py-0 capitalize">
                  {rule.replace('_', ' ')}
                </Badge>
                <span className="text-xs text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compact Issues Table */}
      {results.issues.length > 0 && (
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted/50 px-2 py-1 border-b">
            <Label className="text-sm font-medium">Validation Issues ({results.issues.length})</Label>
          </div>
          <div className="overflow-x-auto max-h-64">
            <table className="w-full text-xs">
              <thead className="bg-muted/30 sticky top-0">
                <tr>
                  <th className="text-left p-1 font-medium">Row</th>
                  <th className="text-left p-1 font-medium">Column</th>
                  <th className="text-left p-1 font-medium">Rule</th>
                  <th className="text-left p-1 font-medium">Sev</th>
                  <th className="text-left p-1 font-medium">Description</th>
                  <th className="text-left p-1 font-medium">Value</th>
                  <th className="text-left p-1 font-medium">Fix</th>
                </tr>
              </thead>
              <tbody>
                {results.issues.slice(0, 50).map((issue, index) => (
                  <tr key={index} className="border-t hover:bg-muted/20">
                    <td className="p-1 font-medium">{issue.row}</td>
                    <td className="p-1 font-mono">{issue.column}</td>
                    <td className="p-1">
                      <Badge variant="outline" className="text-xs px-1 py-0 capitalize">
                        {issue.rule.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-1">
                      <Badge 
                        variant={issue.severity === 'error' ? 'destructive' : 'default'}
                        className={`text-xs px-1 py-0 ${issue.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}`}
                      >
                        {issue.severity[0].toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-1 max-w-32">
                      <div className="truncate" title={issue.description}>
                        {issue.description}
                      </div>
                    </td>
                    <td className="p-1 font-mono max-w-20">
                      <div className="truncate">
                        {issue.sampleValue}
                      </div>
                    </td>
                    <td className="p-1 max-w-32 text-muted-foreground">
                      <div className="truncate" title={issue.fixSuggestion}>
                        {issue.fixSuggestion}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {results.issues.length > 50 && (
            <div className="text-center py-1 text-xs text-muted-foreground bg-muted/30">
              Showing 50 of {results.issues.length} issues
            </div>
          )}
        </div>
      )}

      {/* Success/Error Actions */}
      {results.passed ? (
        <Alert className="p-2">
          <CheckCircle className="h-3 w-3" />
          <AlertDescription className="text-xs">
            All validation checks passed. Ready for import.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="p-2 border border-red-200 bg-red-50/50 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-3 w-3 text-red-500" />
            <span className="text-xs font-medium text-red-800">
              {results.summary.errorCount} errors block import
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-6 text-xs flex-1">
              <FileText className="w-3 h-3 mr-1" />
              Fix & Re-upload
            </Button>
            <Button variant="destructive" className="h-6 text-xs flex-1">
              Skip {new Set(results.issues.filter(i => i.severity === 'error').map(i => i.row)).size} Invalid Rows
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};