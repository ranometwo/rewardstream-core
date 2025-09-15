import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Database, 
  Upload, 
  Settings2, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  Zap,
  Shield,
  BarChart3,
  Clock
} from "lucide-react";
import { DataSourceSelector } from "./DataSourceSelector";
import { FileUploadZone } from "./FileUploadZone";
import { SchemaMapping } from "./SchemaMapping";
import { ImportPreview } from "./ImportPreview";

export type LoadStrategy = 'full_refresh' | 'incremental' | 'upsert';
export type DataCategory = 'transactional' | 'analytical' | 'reference' | 'operational';

interface ImportConfig {
  strategy: LoadStrategy;
  targetTable: string;
  newTableName: string;
  category: DataCategory;
  description: string;
  file: File | null;
  delimiter: string;
  encoding: 'UTF-8' | 'UTF-16' | 'ASCII' | 'ISO-8859-1';
  hasHeader: boolean;
  schemaMapping: any[];
  validationRules: string[];
}

interface EnterpriseDataImportProps {
  onComplete?: (result: any) => void;
}

export const EnterpriseDataImport = ({ onComplete }: EnterpriseDataImportProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<ImportConfig>({
    strategy: 'full_refresh',
    targetTable: '',
    newTableName: '',
    category: 'transactional',
    description: '',
    file: null,
    delimiter: ',',
    encoding: 'UTF-8',
    hasHeader: true,
    schemaMapping: [],
    validationRules: []
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');

  const steps = [
    { 
      id: 'source', 
      title: 'Data Source', 
      subtitle: 'Configure import strategy & destination',
      icon: Database,
      estimatedTime: '2 min' 
    },
    { 
      id: 'ingest', 
      title: 'Data Ingestion', 
      subtitle: 'Upload and validate file format',
      icon: Upload,
      estimatedTime: '3 min' 
    },
    { 
      id: 'transform', 
      title: 'Schema Mapping', 
      subtitle: 'Map fields and define transformations',
      icon: Settings2,
      estimatedTime: '5 min' 
    },
    { 
      id: 'deploy', 
      title: 'Deploy & Execute', 
      subtitle: 'Review and execute the import job',
      icon: CheckCircle2,
      estimatedTime: '1 min' 
    }
  ];

  const updateConfig = (updates: Partial<ImportConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return config.strategy && (config.targetTable || config.newTableName);
      case 1:
        return config.file !== null;
      case 2:
        return config.schemaMapping.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const executeImport = async () => {
    setIsProcessing(true);
    
    const processSteps = [
      'Validating data format...',
      'Analyzing schema compatibility...',
      'Applying transformations...',
      'Loading to destination...',
      'Finalizing import...'
    ];

    for (let i = 0; i < processSteps.length; i++) {
      setProcessStep(processSteps[i]);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    setIsProcessing(false);
    onComplete?.({
      status: 'success',
      recordsProcessed: Math.floor(Math.random() * 10000) + 1000,
      executionTime: '12.3s',
      config
    });
  };

  if (isProcessing) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-0 shadow-elevated">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Zap className="w-10 h-10 text-white animate-pulse" />
                </div>
                <div className="absolute -inset-2 rounded-full border border-primary/20 animate-ping" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Processing Import Job</h2>
                <p className="text-muted-foreground">{processStep}</p>
              </div>
              
              <Progress value={75} className="w-80" />
              
              <div className="grid grid-cols-3 gap-6 text-sm text-center pt-4">
                <div className="flex flex-col items-center space-y-1">
                  <Shield className="w-5 h-5 text-success" />
                  <span className="font-medium">Validated</span>
                  <span className="text-muted-foreground">Schema OK</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="font-medium">Processing</span>
                  <span className="text-muted-foreground">75% complete</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">ETA</span>
                  <span className="text-muted-foreground">30 seconds</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Enterprise Data Import
            </h1>
            <p className="text-muted-foreground mt-1">
              Streamlined, secure data ingestion with enterprise-grade validation
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {steps[currentStep].estimatedTime} remaining
          </Badge>
        </div>

        {/* Progress Stepper */}
        <div className="relative">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all
                    ${isCompleted 
                      ? 'bg-gradient-primary border-primary text-white shadow-glass' 
                      : isActive 
                        ? 'border-primary text-primary bg-primary/5 shadow-enterprise' 
                        : 'border-border text-muted-foreground bg-background'
                    }
                  `}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  
                  <div className="mt-3 text-center max-w-32">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {step.subtitle}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Progress Line */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-border -z-0">
            <div 
              className="h-full bg-gradient-primary transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <Card className="min-h-[500px] border-0 shadow-elevated">
        <CardHeader className="border-b bg-gradient-secondary">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {React.createElement(steps[currentStep].icon, { className: "w-5 h-5" })}
              {steps[currentStep].title}
            </div>
            <Badge variant="secondary">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8">
          {currentStep === 0 && (
            <DataSourceSelector 
              config={config} 
              updateConfig={updateConfig} 
            />
          )}
          
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <FileText className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">Upload Data File</h3>
                <p className="text-muted-foreground">
                  Supported formats: CSV, TSV, JSON, Parquet, Excel (.xlsx)
                </p>
              </div>
              
              <FileUploadZone
                onFileSelect={(file) => updateConfig({ file })}
                onMetadataChange={(metadata) => updateConfig(metadata)}
                selectedFile={config.file}
              />

              {config.file && (
                <Alert className="bg-success/10 border-success/20">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success-foreground">
                    File uploaded successfully. Ready to proceed with schema mapping.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          {currentStep === 2 && (
            <SchemaMapping 
              file={config.file}
              onMappingComplete={(mappings) => updateConfig({ schemaMapping: mappings })}
            />
          )}
          
          {currentStep === 3 && (
            <ImportPreview 
              config={config}
              onExecute={executeImport}
            />
          )}
        </CardContent>
        
        {/* Navigation Footer */}
        <div className="border-t bg-muted/30 px-8 py-4">
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Progress: {Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              <Progress value={((currentStep + 1) / steps.length) * 100} className="w-32" />
            </div>
            
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={executeImport}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-gradient-primary"
              >
                <Zap className="w-4 h-4" />
                Execute Import
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};