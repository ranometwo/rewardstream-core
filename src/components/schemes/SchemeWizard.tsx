import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, Eye } from "lucide-react";
import BasicDetails from "./wizard/BasicDetails";
import AudienceFilters from "./wizard/AudienceFilters";
import ProductScope from "./wizard/ProductScope";
import RewardLogic from "./wizard/RewardLogic";
import SimulateQA from "./wizard/SimulateQA";
import ReviewPublish from "./wizard/ReviewPublish";
import ContextPanel from "./wizard/ContextPanel";

export type SchemeType = "Top Performers" | "Product Category + Slab" | "Bundles";

export interface SchemeConfig {
  // Basic Details
  name: string;
  description: string;
  type: SchemeType;
  startDate: Date | null;
  endDate: Date | null;
  rewardTiming: "End of scheme" | "Weekly" | "Monthly";
  
  // Audience & Geography
  audienceFilters: {
    zones: string[];
    regions: string[];
    tradeTTY: string[];
    pincodes: string[];
    userPersona: string[];
    contractorTier: string[];
  };
  
  // Product Scope
  productScope: {
    enabled: boolean;
    selectedCategories: string[];
    selectedSKUs: string[];
    includeAll: boolean;
  };
  
  // Reward Logic (varies by type)
  rewardLogic: {
    // Top Performers
    maxWinners?: number;
    multiplier?: number;
    
    // Slab
    slabs?: Array<{
      id: string;
      lowerBound: number;
      upperBound: number | null;
      bonus: number;
      label: string;
    }>;
    
    // Bundles
    bundles?: Array<{
      id: string;
      name: string;
      skus: Array<{
        code: string;
        minQuantity: number;
      }>;
      bonus: number;
    }>;
  };
}

interface SchemeWizardProps {
  onBack: () => void;
  onSchemeSaved: (config: SchemeConfig) => void;
}

const steps = [
  { id: 1, name: "Basic Details", description: "Scheme name, type & timing" },
  { id: 2, name: "Audience & Geography", description: "Target contractors & regions" },
  { id: 3, name: "Product Scope", description: "SKUs and categories (optional)" },
  { id: 4, name: "Reward Logic", description: "Define qualification & rewards" },
  { id: 5, name: "Simulate & QA", description: "Test scenarios & validation" },
  { id: 6, name: "Review & Publish", description: "Final review & activation" }
];

const SchemeWizard: React.FC<SchemeWizardProps> = ({ onBack, onSchemeSaved }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<SchemeConfig>({
    name: "",
    description: "",
    type: "Top Performers",
    startDate: null,
    endDate: null,
    rewardTiming: "End of scheme",
    audienceFilters: {
      zones: [],
      regions: [],
      tradeTTY: [],
      pincodes: [],
      userPersona: [],
      contractorTier: []
    },
    productScope: {
      enabled: false,
      selectedCategories: [],
      selectedSKUs: [],
      includeAll: true
    },
    rewardLogic: {}
  });

  const updateConfig = (updates: Partial<SchemeConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const canProceed = (step: number): boolean => {
    switch (step) {
      case 1:
        return config.name.trim() !== "" && !!config.startDate && !!config.endDate;
      case 2:
        return true; // Audience filters are optional
      case 3:
        return true; // Product scope is optional
      case 4:
        if (config.type === "Top Performers") {
          return !!(config.rewardLogic.maxWinners && config.rewardLogic.multiplier);
        }
        if (config.type === "Product Category + Slab") {
          return !!(config.rewardLogic.slabs && config.rewardLogic.slabs.length > 0);
        }
        if (config.type === "Bundles") {
          return !!(config.rewardLogic.bundles && config.rewardLogic.bundles.length > 0);
        }
        return false;
      case 5:
        return true; // Simulation is optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length && canProceed(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    // Save as draft logic
    console.log("Saving draft:", config);
  };

  const handlePublish = () => {
    onSchemeSaved(config);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicDetails config={config} updateConfig={updateConfig} />;
      case 2:
        return <AudienceFilters config={config} updateConfig={updateConfig} />;
      case 3:
        return <ProductScope config={config} updateConfig={updateConfig} />;
      case 4:
        return <RewardLogic config={config} updateConfig={updateConfig} />;
      case 5:
        return <SimulateQA config={config} />;
      case 6:
        return <ReviewPublish config={config} onPublish={handlePublish} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card shadow-enterprise sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {config.name || "New Loyalty Scheme"}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline">{config.type}</Badge>
                <Badge variant="secondary">Draft</Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleSaveDraft} className="hidden md:flex">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button variant="outline" className="hidden md:flex">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
        
        {/* Progress */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </span>
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Stepper */}
        <div className="w-80 bg-card border-r shadow-enterprise p-6 sticky top-[120px] h-fit">
          <div className="space-y-1">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  currentStep === step.id
                    ? "bg-primary/10 border border-primary/20"
                    : currentStep > step.id
                    ? "bg-success/5 border border-success/20"
                    : "hover:bg-accent"
                }`}
                onClick={() => {
                  if (step.id <= currentStep || (step.id === currentStep + 1 && canProceed(currentStep))) {
                    setCurrentStep(step.id);
                  }
                }}
              >
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep > step.id
                      ? "bg-success text-success-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Step Content */}
          <div className="flex-1 p-6 max-w-4xl">
            {renderStepContent()}
            
            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex items-center space-x-3">
                {currentStep < steps.length && (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed(currentStep)}
                    className="shadow-enterprise"
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
                {currentStep === steps.length && (
                  <Button
                    onClick={handlePublish}
                    className="bg-gradient-primary shadow-glass"
                  >
                    Publish Scheme
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Context Panel */}
          <div className="w-80 p-6 bg-accent/30 border-l sticky top-[120px] h-fit">
            <ContextPanel config={config} currentStep={currentStep} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeWizard;