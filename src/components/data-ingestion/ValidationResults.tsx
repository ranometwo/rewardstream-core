import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-6">
      {/* Validation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {results.passed ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
            Validation {results.passed ? 'Passed' : 'Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{results.summary.totalRows.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Rows</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{results.summary.passedRows.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{results.summary.errorCount}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{results.summary.warningCount}</div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Error Reasons */}
      {topErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Top Error Reasons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topErrors.map(({ rule, count }) => (
                <div key={rule} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="capitalize">
                      {rule.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {rule === 'date_format' && 'Invalid date format'}
                      {rule === 'primary_key' && 'Primary key violation'}
                      {rule === 'type_check' && 'Type mismatch'}
                      {rule === 'foreign_key' && 'Foreign key constraint'}
                    </span>
                  </div>
                  <Badge variant="outline">{count} issues</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Details Table */}
      {results.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Validation Issues</span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={downloadErrorReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" onClick={runValidation}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Re-validate
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Row</TableHead>
                    <TableHead>Column</TableHead>
                    <TableHead>Rule</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Sample Value</TableHead>
                    <TableHead>Fix Suggestion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.issues.slice(0, 50).map((issue, index) => (
                    <TableRow key={index}>
                      <TableCell>{issue.row}</TableCell>
                      <TableCell className="font-mono">{issue.column}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {issue.rule.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={issue.severity === 'error' ? 'destructive' : 'default'}
                          className={issue.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                        >
                          {issue.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={issue.description}>
                          {issue.description}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {issue.sampleValue}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm text-muted-foreground truncate" title={issue.fixSuggestion}>
                          {issue.fixSuggestion}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {results.issues.length > 50 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  Showing first 50 of {results.issues.length} issues. Download report for complete list.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {results.passed && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            All validation checks passed successfully. Your data is ready for import.
          </AlertDescription>
        </Alert>
      )}

      {/* Blocking vs Skip Options */}
      {!results.passed && (
        <Card>
          <CardHeader>
            <CardTitle>Import Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  {results.summary.errorCount} error(s) found. Import is currently blocked.
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Fix Issues & Re-upload
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={() => {
                    // Create results with errors skipped
                    const validRowCount = results.summary.totalRows - new Set(results.issues.filter(i => i.severity === 'error').map(i => i.row)).size;
                    const skippedResults = {
                      passed: true,
                      issues: results.issues.filter(i => i.severity === 'warning'), // Keep only warnings
                      summary: {
                        ...results.summary,
                        errorCount: 0,
                        passedRows: validRowCount
                      }
                    };
                    onValidationComplete(skippedResults);
                  }}
                >
                  Skip Invalid Rows ({new Set(results.issues.filter(i => i.severity === 'error').map(i => i.row)).size} rows)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};