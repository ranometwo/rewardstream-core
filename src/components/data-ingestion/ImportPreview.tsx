import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Database, 
  FileText, 
  Zap,
  Clock,
  Shield,
  BarChart3,
  Settings
} from "lucide-react";

interface ImportPreviewProps {
  config: any;
  onExecute: () => void;
}

export const ImportPreview = ({ config, onExecute }: ImportPreviewProps) => {
  const estimatedMetrics = {
    recordCount: Math.floor(Math.random() * 50000) + 10000,
    estimatedTime: '12-18 seconds',
    storageSize: '2.4 MB',
    cpuUnits: 'Low',
    memoryUsage: '64 MB'
  };

  const validationChecks = [
    { 
      name: 'File Format Validation', 
      status: 'passed', 
      description: 'CSV format is valid and parseable',
      details: `${config.file?.name} - ${(config.file?.size / 1024 / 1024).toFixed(2)} MB`
    },
    { 
      name: 'Schema Compatibility', 
      status: 'passed', 
      description: 'All column types are compatible with target schema',
      details: `${config.schemaMapping?.length || 0} columns mapped successfully`
    },
    { 
      name: 'Data Quality', 
      status: 'warning', 
      description: 'Some null values detected in non-nullable fields',
      details: '2.3% of records may need transformation'
    },
    { 
      name: 'Primary Key Validation', 
      status: config.schemaMapping?.some((m: any) => m.isPrimaryKey) ? 'passed' : 'failed', 
      description: config.schemaMapping?.some((m: any) => m.isPrimaryKey) 
        ? 'Primary key constraint is satisfied' 
        : 'No primary key defined',
      details: config.schemaMapping?.some((m: any) => m.isPrimaryKey) 
        ? 'All records have unique primary key values' 
        : 'Consider defining a primary key for data integrity'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default: return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-success';
      case 'warning': return 'text-warning';
      case 'failed': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const hasBlockingIssues = validationChecks.some(check => check.status === 'failed');
  const hasWarnings = validationChecks.some(check => check.status === 'warning');

  return (
    <div className="space-y-6">
      {/* Execution Plan Header */}
      <div className="text-center pb-4">
        <h2 className="text-2xl font-semibold mb-2">Import Execution Plan</h2>
        <p className="text-muted-foreground">
          Review the configuration and validation results before executing the import job.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="w-4 h-4" />
                Import Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Load Strategy</span>
                  <Badge variant="outline" className="capitalize">
                    {config.strategy?.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Target Table</span>
                  <Badge variant="outline" className="font-mono">
                    {config.targetTable || config.newTableName}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Data Category</span>
                  <Badge variant="secondary" className="capitalize">
                    {config.category?.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">File Format</span>
                  <Badge variant="outline">
                    {config.file?.name?.split('.').pop()?.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Processing Options</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span>Delimiter:</span>
                    <code>{config.delimiter}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Encoding:</span>
                    <code>{config.encoding}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Header Row:</span>
                    <code>{config.hasHeader ? 'Yes' : 'No'}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Transforms:</span>
                    <code>{config.schemaMapping?.reduce((acc: number, m: any) => acc + m.transforms?.length || 0, 0) || 0}</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="w-4 h-4" />
                Estimated Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <Database className="w-6 h-6 text-primary mx-auto mb-1" />
                  <div className="text-lg font-bold">{estimatedMetrics.recordCount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Records</div>
                </div>
                
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-1" />
                  <div className="text-lg font-bold">{estimatedMetrics.estimatedTime}</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
                
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <FileText className="w-6 h-6 text-primary mx-auto mb-1" />
                  <div className="text-lg font-bold">{estimatedMetrics.storageSize}</div>
                  <div className="text-xs text-muted-foreground">Storage</div>
                </div>
                
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <Shield className="w-6 h-6 text-primary mx-auto mb-1" />
                  <div className="text-lg font-bold">{estimatedMetrics.cpuUnits}</div>
                  <div className="text-xs text-muted-foreground">Resource Usage</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Validation Results */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="w-4 h-4" />
              Validation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {validationChecks.map((check, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(check.status)}
                      <h4 className="text-sm font-medium">{check.name}</h4>
                    </div>
                    <Badge 
                      variant={check.status === 'passed' ? 'default' : 'outline'}
                      className={`text-xs ${getStatusColor(check.status)}`}
                    >
                      {check.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{check.description}</p>
                  <p className="text-xs text-muted-foreground font-mono">{check.details}</p>
                </div>
              ))}
            </div>

            {hasWarnings && (
              <Alert className="mt-4 bg-warning/10 border-warning/20">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-warning-foreground text-sm">
                  Some validation warnings detected. The import can proceed but may require data cleanup.
                </AlertDescription>
              </Alert>
            )}

            {hasBlockingIssues && (
              <Alert className="mt-4 bg-destructive/10 border-destructive/20">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive-foreground text-sm">
                  Critical validation errors detected. Please resolve these issues before proceeding.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Execution Button */}
      <Card className="bg-gradient-secondary border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Ready to Execute Import</h3>
              <p className="text-sm text-muted-foreground">
                {hasBlockingIssues 
                  ? 'Please resolve validation errors before proceeding.' 
                  : hasWarnings
                  ? 'Import can proceed with warnings. Data may require cleanup post-import.'
                  : 'All validation checks passed. Ready to execute import job.'
                }
              </p>
            </div>
            
            <Button 
              onClick={onExecute}
              disabled={hasBlockingIssues}
              className="flex items-center gap-2 bg-gradient-primary px-6"
              size="lg"
            >
              <Zap className="w-4 h-4" />
              Execute Import
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};