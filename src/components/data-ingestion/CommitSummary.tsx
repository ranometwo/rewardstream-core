import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Database, 
  Upload, 
  Clock, 
  User, 
  FileText,
  Plus,
  RefreshCw,
  GitCommit
} from "lucide-react";
import { Label } from "@/components/ui/label";

interface CommitSummaryProps {
  importData: {
    mode: 'append' | 'upsert' | 'replace';
    targetDataset: string;
    newDatasetName: string;
    category: string;
    description: string;
    file: File | null;
    mappings: any[];
    validationResults: any;
  };
  onCommit?: () => void;
}

export const CommitSummary = ({ importData, onCommit }: CommitSummaryProps) => {
  const [isCommitting, setIsCommitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [commitResult, setCommitResult] = useState<{
    success: boolean;
    insertedRows: number;
    updatedRows: number;
    skippedRows: number;
    newVersionId?: string;
    datasetId?: string;
  } | null>(null);

  const handleCommit = async () => {
    setIsCommitting(true);
    setProgress(0);

    try {
      // Simulate commit process
      setProgress(25);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProgress(75);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate results based on mode
      let result;
      const totalRows = importData.validationResults?.summary?.totalRows || 1000;
      
      if (importData.mode === 'append') {
        result = {
          success: true,
          insertedRows: totalRows - (importData.validationResults?.summary?.errorCount || 0),
          updatedRows: 0,
          skippedRows: importData.validationResults?.summary?.errorCount || 0
        };
      } else if (importData.mode === 'upsert') {
        result = {
          success: true,
          insertedRows: Math.floor(totalRows * 0.7),
          updatedRows: Math.floor(totalRows * 0.3),
          skippedRows: importData.validationResults?.summary?.errorCount || 0
        };
      } else { // replace
        result = {
          success: true,
          insertedRows: totalRows - (importData.validationResults?.summary?.errorCount || 0),
          updatedRows: 0,
          skippedRows: importData.validationResults?.summary?.errorCount || 0,
          newVersionId: 'v2',
          datasetId: 'new-dataset-id'
        };
      }

      setCommitResult(result);
      setProgress(100);
      
      // Call completion handler
      onCommit?.();

    } catch (error) {
      console.error('Commit error:', error);
      setCommitResult({
        success: false,
        insertedRows: 0,
        updatedRows: 0,
        skippedRows: 0
      });
    } finally {
      setIsCommitting(false);
    }
  };

  const getChangesetSummary = () => {
    if (!importData.validationResults) return 'Processing...';
    
    const totalRows = importData.validationResults.summary.totalRows;
    const errorRows = importData.validationResults.summary.errorCount;
    const validRows = totalRows - errorRows;

    switch (importData.mode) {
      case 'append':
        return `+${validRows.toLocaleString()} new rows`;
      case 'upsert':
        return `~${Math.floor(validRows * 0.7).toLocaleString()} inserts / ${Math.floor(validRows * 0.3).toLocaleString()} updates`;
      case 'replace':
        return `v2 created with ${validRows.toLocaleString()} rows & activated`;
      default:
        return 'Unknown operation';
    }
  };

  if (isCommitting) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mb-4">
            <Upload className="w-8 h-8 mx-auto animate-bounce text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Committing Changes</h3>
          <p className="text-muted-foreground">
            {progress < 25 && 'Preparing data for import...'}
            {progress >= 25 && progress < 50 && 'Validating relationships...'}
            {progress >= 50 && progress < 75 && 'Writing to database...'}
            {progress >= 75 && 'Finalizing import...'}
          </p>
        </div>
        <Progress value={progress} className="w-full" />
      </div>
    );
  }

  if (commitResult) {
    return (
      <div className="space-y-6">
        {/* Success/Failure Status */}
        <Card className={commitResult.success ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {commitResult.success ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <RefreshCw className="w-6 h-6 text-red-500" />
              )}
              Import {commitResult.success ? 'Completed Successfully' : 'Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {commitResult.success ? (
              <p className="text-green-700">
                Your data has been successfully imported and is now available for analysis.
              </p>
            ) : (
              <p className="text-red-700">
                Import failed due to an unexpected error. Please try again or contact support.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        {commitResult.success && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {commitResult.insertedRows.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Inserted</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {commitResult.updatedRows > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {commitResult.updatedRows.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Updated</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {commitResult.skippedRows > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {commitResult.skippedRows.toLocaleString()}
                      </div>
                       <div className="text-sm text-muted-foreground">Skipped</div>
                     </div>
                   </div>
                 </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full">
                <Database className="w-4 h-4 mr-2" />
                View Data Management
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                View Data Quality Report
              </Button>
              {commitResult.newVersionId && (
                <Button variant="outline" className="w-full">
                  <GitCommit className="w-4 h-4 mr-2" />
                  View Version History
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Import Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCommit className="w-5 h-5" />
            Import Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Mode</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="capitalize">
                    {importData.mode}
                  </Badge>
                  <span className="text-sm">
                    {importData.mode === 'append' && 'Add new rows only'}
                    {importData.mode === 'upsert' && 'Update existing, insert new'}
                    {importData.mode === 'replace' && 'Create new version'}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Target</Label>
                <div className="mt-1">
                  {importData.mode === 'replace' ? importData.newDatasetName : importData.targetDataset}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">File</Label>
              <div className="flex items-center gap-2 mt-1">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span>{importData.file?.name}</span>
                <Badge variant="outline">
                  {((importData.file?.size || 0) / 1024 / 1024).toFixed(2)} MB
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">Changeset</Label>
              <div className="mt-1 text-lg font-medium">
                {getChangesetSummary()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mapping Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Mapping Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Primary Key:</span>
              <Badge variant="outline">
                {importData.mappings?.find(m => m.role === 'primary_key')?.sourceColumn || 'Not set'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Foreign Keys:</span>
              <Badge variant="outline">
                {importData.mappings?.filter(m => m.role === 'foreign_key').length || 0} relations
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Attributes:</span>
              <Badge variant="outline">
                {importData.mappings?.filter(m => m.role === 'attribute').length || 0} columns
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Status */}
      {importData.validationResults && (
        <Card>
          <CardHeader>
            <CardTitle>Validation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <Badge 
                  variant={importData.validationResults.passed ? 'default' : 'destructive'}
                  className={importData.validationResults.passed ? 'bg-green-100 text-green-800' : ''}
                >
                  {importData.validationResults.passed ? 'Passed' : 'Has Issues'}
                </Badge>
              </div>
              {!importData.validationResults.passed && (
                <div className="flex items-center justify-between text-sm">
                  <span>Errors:</span>
                  <span>{importData.validationResults.summary.errorCount} issues found</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Import Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>Started by: Current User</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>Time: {new Date().toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-muted-foreground" />
              <span>Version will be preserved for audit</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commit Action */}
      <div className="flex gap-4">
        <Button 
          onClick={handleCommit}
          disabled={importData.validationResults && !importData.validationResults.passed}
          className="flex-1"
        >
          <Upload className="w-4 h-4 mr-2" />
          Commit Import
        </Button>
        <Button variant="outline" className="flex-1">
          Save as Draft
        </Button>
      </div>

      {/* Warnings */}
      {importData.validationResults && !importData.validationResults.passed && (
        <Alert variant="destructive">
          <RefreshCw className="h-4 w-4" />
          <AlertDescription>
            Cannot commit with validation errors. Please resolve issues or skip invalid rows.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};