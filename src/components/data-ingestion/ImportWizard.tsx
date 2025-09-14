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
        return importData.newDatasetName !== '' && importData.category && importData.category.length > 0;
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
    <div className="max-w-7xl mx-auto p-3">
      {/* Compact Breadcrumb Progress */}
      <div className="flex items-center gap-2 p-2 mb-3 bg-muted/30 rounded-lg">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                isCompleted 
                  ? 'bg-primary/10 text-primary' 
                  : isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground'
              }`}>
                <StepIcon className="w-3 h-3" />
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{index + 1}</span>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="w-3 h-3 mx-1 text-muted-foreground" />
              )}
            </div>
          );
        })}
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {currentStep + 1}/{steps.length}
          </Badge>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              onClick={prevStep}
              disabled={currentStep === 0}
              className="h-6 px-2"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
            <Button 
              onClick={nextStep}
              disabled={currentStep === steps.length - 1 || !canProceed()}
              className="h-6 px-2"
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Streamlined Content */}
      <div className="bg-background border rounded-lg">
        <div className="border-b p-3">
          <h2 className="text-lg font-semibold">{steps[currentStep].title}</h2>
        </div>
        <div className="p-3">
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
        </div>
      </div>
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
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-2 block">Import Mode</Label>
        <RadioGroup 
          value={importData.mode} 
          onValueChange={(mode) => updateImportData({ mode })}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <div className="flex items-center space-x-2 p-3 border rounded-md">
            <RadioGroupItem value="append" id="append" />
            <div className="flex-1">
              <Label htmlFor="append" className="font-medium text-sm">Append</Label>
              <p className="text-xs text-muted-foreground">Add new rows</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-md">
            <RadioGroupItem value="upsert" id="upsert" />
            <div className="flex-1">
              <Label htmlFor="upsert" className="font-medium text-sm">Upsert</Label>
              <p className="text-xs text-muted-foreground">Update or insert</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-md">
            <RadioGroupItem value="replace" id="replace" />
            <div className="flex-1">
              <Label htmlFor="replace" className="font-medium text-sm">Replace</Label>
              <p className="text-xs text-muted-foreground">New version</p>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(importData.mode === 'append' || importData.mode === 'upsert') && (
          <div className="space-y-1">
            <Label htmlFor="target-dataset" className="text-sm">Target Dataset</Label>
            <Select onValueChange={(value) => updateImportData({ targetDataset: value })}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select dataset..." />
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
          <>
            <div className="space-y-1">
              <Label htmlFor="dataset-name" className="text-sm">Dataset Name</Label>
              <Input
                id="dataset-name"
                value={importData.newDatasetName}
                onChange={(e) => updateImportData({ newDatasetName: e.target.value })}
                placeholder="Enter name..."
                className="h-8"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="category" className="text-sm">Category</Label>
              <Select onValueChange={(value) => updateImportData({ category: value })}>
                <SelectTrigger className="h-8">
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
              <div className="space-y-1">
                <Label htmlFor="custom-category" className="text-sm">Custom Category</Label>
                <Input
                  id="custom-category"
                  value={importData.customCategory}
                  onChange={(e) => updateImportData({ customCategory: e.target.value })}
                  placeholder="Custom category..."
                  className="h-8"
                />
              </div>
            )}

            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="description" className="text-sm">Description</Label>
              <Textarea
                id="description"
                value={importData.description}
                onChange={(e) => updateImportData({ description: e.target.value })}
                placeholder="Dataset description..."
                rows={2}
                className="text-sm"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};