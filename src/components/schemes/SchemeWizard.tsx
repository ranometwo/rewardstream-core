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
      {/* Compact Header */}
      <div className="border-b bg-card shadow-enterprise sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Schemes
            </Button>
            <div className="h-4 w-px bg-border" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {config.name || "New Loyalty Scheme"}
              </h1>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">{config.type}</Badge>
                <Badge variant="secondary" className="text-xs">Draft</Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={handleSaveDraft}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Vertical Stepper */}
        <div className="w-72 bg-card border-r p-4 sticky top-[80px] h-[calc(100vh-80px)]">
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
              Progress: {currentStep} of {steps.length}
            </div>
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isAccessible = step.id <= currentStep || (step.id === currentStep + 1 && canProceed(currentStep));
              
              return (
                <div key={step.id} className="relative">
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div 
                      className={`absolute left-4 top-8 w-0.5 h-8 ${
                        isCompleted ? 'bg-success' : 'bg-border'
                      }`}
                    />
                  )}
                  
                  <div
                    className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-accent/50 ${
                      isActive 
                        ? "bg-primary/10 border border-primary/20 shadow-sm" 
                        : isCompleted
                        ? "bg-success/5" 
                        : ""
                    } ${!isAccessible ? 'cursor-not-allowed opacity-60' : ''}`}
                    onClick={() => {
                      if (isAccessible) {
                        setCurrentStep(step.id);
                      }
                    }}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : isCompleted
                          ? "bg-success text-success-foreground border-success"
                          : "bg-background text-muted-foreground border-border"
                      }`}
                    >
                      {isCompleted ? "✓" : step.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm leading-tight ${
                        isActive ? "text-primary" : isCompleted ? "text-success" : "text-foreground"
                      }`}>
                        {step.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Mini Context Panel */}
          <div className="mt-6 p-3 bg-accent/30 rounded-lg">
            <h3 className="text-sm font-medium text-foreground mb-2">Quick Info</h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>Type: {config.type}</div>
              {config.startDate && (
                <div>Start: {config.startDate.toLocaleDateString()}</div>
              )}
              {config.endDate && (
                <div>End: {config.endDate.toLocaleDateString()}</div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 max-w-none">
          <div className="p-6">
            {renderStepContent()}
          </div>
          
          {/* Sticky Navigation */}
          <div className="sticky bottom-0 bg-card border-t p-4 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-2">
              {currentStep < steps.length && (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed(currentStep)}
                  className="bg-gradient-primary shadow-glass"
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
      </div>
    </div>
  );
};

export default SchemeWizard;