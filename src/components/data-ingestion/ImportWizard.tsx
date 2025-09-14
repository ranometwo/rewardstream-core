import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, ChevronRight, Database, Upload, Settings, CheckCircle } from "lucide-react";
import { FileUploadZone } from "./FileUploadZone";
import { DataPreview } from "./DataPreview";
import { MappingWorkshop } from "./MappingWorkshop";
import { ValidationResults } from "./ValidationResults";
import { CommitSummary } from "./CommitSummary";

export type ImportMode = 'append' | 'upsert' | 'replace';
export type DatasetCategory = 'event_data' | 'user_data' | 'product_data' | 'other';

interface ImportWizardProps {
  onComplete?: () => void;
}

export const ImportWizard = ({ onComplete }: ImportWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [importData, setImportData] = useState({
    mode: 'append' as ImportMode,
    targetDataset: '',
    newDatasetName: '',
    category: 'event_data' as DatasetCategory,
    customCategory: '',
    description: '',
    file: null as File | null,
    delimiter: ',',
    encoding: 'UTF-8',
    profiledData: null,
    mappings: [],
    validationResults: null
  });

  const steps = [
    { id: 'intent', title: 'Import Intent', icon: Database },
    { id: 'upload', title: 'File Upload', icon: Upload },
    { id: 'preview', title: 'Data Preview', icon: Settings },
    { id: 'mapping', title: 'Mapping Workshop', icon: Settings },
    { id: 'validation', title: 'Validation', icon: CheckCircle },
    { id: 'commit', title: 'Commit', icon: CheckCircle }
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Intent
        if (importData.mode === 'append' || importData.mode === 'upsert') {
          return importData.targetDataset !== '';
        }
        return importData.newDatasetName !== '' && importData.category !== '' && importData.category.length > 0;
      case 1: // Upload
        return importData.file !== null;
      case 2: // Preview
        return importData.profiledData !== null;
      case 3: // Mapping
        return importData.mappings.length > 0;
      case 4: // Validation
        return importData.validationResults !== null;
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

  const updateImportData = (updates: Partial<typeof importData>) => {
    setImportData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isCompleted 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : isActive 
                      ? 'border-primary text-primary bg-primary/10' 
                      : 'border-muted-foreground text-muted-foreground'
                }`}>
                  <StepIcon className="w-5 h-5" />
                </div>
                <div className="ml-3 hidden md:block">
                  <div className={`text-sm font-medium ${
                    isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 mx-4 ${
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="min-h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {steps[currentStep].title}
            <Badge variant="outline">Step {currentStep + 1} of {steps.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <IntentStep 
              importData={importData} 
              updateImportData={updateImportData} 
            />
          )}
          {currentStep === 1 && (
            <FileUploadZone
              onFileSelect={(file) => updateImportData({ file })}
              onMetadataChange={(metadata) => updateImportData(metadata)}
              selectedFile={importData.file}
            />
          )}
          {currentStep === 2 && (
            <DataPreview
              file={importData.file}
              delimiter={importData.delimiter}
              onProfileComplete={(profiledData) => updateImportData({ profiledData })}
            />
          )}
          {currentStep === 3 && (
            <MappingWorkshop
              profiledData={importData.profiledData}
              onMappingComplete={(mappings) => updateImportData({ mappings })}
            />
          )}
          {currentStep === 4 && (
            <ValidationResults
              mappings={importData.mappings}
              file={importData.file}
              onValidationComplete={(results) => updateImportData({ validationResults: results })}
            />
          )}
          {currentStep === 5 && (
            <CommitSummary
              importData={importData}
              onCommit={onComplete}
            />
          )}
        </CardContent>
        
        {/* Navigation */}
        <div className="flex justify-between items-center p-6 border-t">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>
          
          <Button 
            onClick={nextStep}
            disabled={currentStep === steps.length - 1 || !canProceed()}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Intent Step Component
interface IntentStepProps {
  importData: any;
  updateImportData: (updates: any) => void;
}

const IntentStep = ({ importData, updateImportData }: IntentStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Import Mode</Label>
        <RadioGroup 
          value={importData.mode} 
          onValueChange={(mode) => updateImportData({ mode })}
          className="mt-3"
        >
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="append" id="append" />
            <div className="flex-1">
              <Label htmlFor="append" className="font-medium">Append</Label>
              <p className="text-sm text-muted-foreground">Add new rows to existing dataset (reject duplicates)</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="upsert" id="upsert" />
            <div className="flex-1">
              <Label htmlFor="upsert" className="font-medium">Merge/Upsert</Label>
              <p className="text-sm text-muted-foreground">Update on PK match, else insert</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="replace" id="replace" />
            <div className="flex-1">
              <Label htmlFor="replace" className="font-medium">Replace (Versioned)</Label>
              <p className="text-sm text-muted-foreground">Create new immutable version (old version retained)</p>
            </div>
          </div>
        </RadioGroup>
      </div>

      {(importData.mode === 'append' || importData.mode === 'upsert') && (
        <div className="space-y-2">
          <Label htmlFor="target-dataset">Target Dataset</Label>
          <Select onValueChange={(value) => updateImportData({ targetDataset: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select existing dataset..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="users">Users Dataset</SelectItem>
              <SelectItem value="events">Events Dataset</SelectItem>
              <SelectItem value="products">Products Dataset</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {importData.mode === 'replace' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataset-name">New Dataset Name</Label>
            <Input
              id="dataset-name"
              value={importData.newDatasetName}
              onChange={(e) => updateImportData({ newDatasetName: e.target.value })}
              placeholder="Enter dataset name..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Dataset Category</Label>
            <Select onValueChange={(value) => updateImportData({ category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="event_data">Event Data</SelectItem>
                <SelectItem value="user_data">User Data</SelectItem>
                <SelectItem value="product_data">Product Data</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {importData.category === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="custom-category">Custom Category Label</Label>
              <Input
                id="custom-category"
                value={importData.customCategory}
                onChange={(e) => updateImportData({ customCategory: e.target.value })}
                placeholder="Enter custom category..."
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={importData.description}
              onChange={(e) => updateImportData({ description: e.target.value })}
              placeholder="Describe this dataset..."
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  );
};