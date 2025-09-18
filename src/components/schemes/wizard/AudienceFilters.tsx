import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Users, MapPin, Building, CreditCard } from "lucide-react";
import { SchemeConfig } from "../SchemeWizard";

interface AudienceFiltersProps {
  config: SchemeConfig;
  updateConfig: (updates: Partial<SchemeConfig>) => void;
}

const mockData = {
  zones: ["North", "South", "East", "West"],
  regions: [
    "Maharashtra", "Haryana", "Gujarat", "Uttar Pradesh", "Punjab", 
    "Karnataka", "Tamil Nadu", "Rajasthan", "Madhya Pradesh", "West Bengal"
  ],
  tradeTTY: [
    "Pune Urban", "Hisar", "Gurugram", "Thane", "Noida", "Mumbai Central",
    "Delhi NCR", "Ahmedabad", "Lucknow", "Jaipur", "Kolkata"
  ],
  userPersona: ["Contractor", "AID", "Dealer"],
  contractorTier: ["Gold", "Silver", "Bronze", "Platinum"]
};

const AudienceFilters: React.FC<AudienceFiltersProps> = ({ config, updateConfig }) => {
  const [useOrLogic, setUseOrLogic] = useState(false);
  const [pincodeInput, setPincodeInput] = useState("");

  const updateAudienceFilters = (key: keyof typeof config.audienceFilters, values: string[]) => {
    updateConfig({
      audienceFilters: {
        ...config.audienceFilters,
        [key]: values
      }
    });
  };

  const toggleSelection = (key: keyof typeof config.audienceFilters, value: string) => {
    const current = config.audienceFilters[key];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateAudienceFilters(key, updated);
  };

  const addPincodes = () => {
    if (!pincodeInput.trim()) return;
    
    const newPincodes = pincodeInput
      .split(/[,\n]/)
      .map(p => p.trim())
      .filter(p => p.length === 6 && /^\d+$/.test(p))
      .filter(p => !config.audienceFilters.pincodes.includes(p));
    
    if (newPincodes.length > 0) {
      updateAudienceFilters("pincodes", [...config.audienceFilters.pincodes, ...newPincodes]);
      setPincodeInput("");
    }
  };

  const removePincode = (pincode: string) => {
    updateAudienceFilters("pincodes", config.audienceFilters.pincodes.filter(p => p !== pincode));
  };

  const getEstimatedUsers = () => {
    // Mock calculation based on selections
    let base = 15000;
    if (config.audienceFilters.zones.length > 0) {
      base = base * (config.audienceFilters.zones.length / 4);
    }
    if (config.audienceFilters.regions.length > 0) {
      base = base * (config.audienceFilters.regions.length / 10);
    }
    if (config.audienceFilters.contractorTier.length > 0) {
      base = base * (config.audienceFilters.contractorTier.length / 4);
    }
    return Math.round(base);
  };

  const FilterSection = ({ 
    title, 
    icon, 
    options, 
    selectedValues, 
    onToggle, 
    description 
  }: {
    title: string;
    icon: React.ReactNode;
    options: string[];
    selectedValues: string[];
    onToggle: (value: string) => void;
    description?: string;
  }) => (
    <Card className="border-border shadow-enterprise">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${title}-${option}`}
                checked={selectedValues.includes(option)}
                onCheckedChange={() => onToggle(option)}
              />
              <Label
                htmlFor={`${title}-${option}`}
                className="text-sm font-normal cursor-pointer"
              >
                {option}
              </Label>
            </div>
          ))}
        </div>
        
        {selectedValues.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">Selected ({selectedValues.length}):</p>
            <div className="flex flex-wrap gap-1">
              {selectedValues.map((value) => (
                <Badge key={value} variant="secondary" className="text-xs">
                  {value}
                  <button
                    onClick={() => onToggle(value)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Audience & Geography</h2>
        <p className="text-muted-foreground">
          Define your target audience and geographic coverage
        </p>
      </div>

      {/* Logic Toggle */}
      <Card className="border-border shadow-enterprise bg-gradient-secondary">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Filter Logic</h3>
              <p className="text-sm text-muted-foreground">
                {useOrLogic 
                  ? "Groups treated as OR (contractor matches ANY group)" 
                  : "Groups treated as AND (contractor must match ALL selections within each group)"
                }
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="logic-toggle" className="text-sm">Use OR logic</Label>
              <Switch
                id="logic-toggle"
                checked={useOrLogic}
                onCheckedChange={setUseOrLogic}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geographic Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FilterSection
          title="Zone"
          icon={<MapPin className="h-4 w-4" />}
          options={mockData.zones}
          selectedValues={config.audienceFilters.zones}
          onToggle={(value) => toggleSelection("zones", value)}
          description="Primary geographic zones"
        />

        <FilterSection
          title="Region (State)"
          icon={<Building className="h-4 w-4" />}
          options={mockData.regions}
          selectedValues={config.audienceFilters.regions}
          onToggle={(value) => toggleSelection("regions", value)}
          description="Indian states and union territories"
        />
      </div>

      <FilterSection
        title="Trade TTY (Territory)"
        icon={<MapPin className="h-4 w-4" />}
        options={mockData.tradeTTY}
        selectedValues={config.audienceFilters.tradeTTY}
        onToggle={(value) => toggleSelection("tradeTTY", value)}
        description="Specific territories and districts"
      />

      {/* Pincode Section */}
      <Card className="border-border shadow-enterprise">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Pincode Targeting
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Add specific 6-digit pincodes (comma or line separated)
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="411001, 125001, 122002..."
              value={pincodeInput}
              onChange={(e) => setPincodeInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addPincodes}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          {config.audienceFilters.pincodes.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Selected Pincodes ({config.audienceFilters.pincodes.length}):
              </p>
              <div className="flex flex-wrap gap-1">
                {config.audienceFilters.pincodes.map((pincode) => (
                  <Badge key={pincode} variant="secondary" className="text-xs">
                    {pincode}
                    <button
                      onClick={() => removePincode(pincode)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* User Persona & Tier Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FilterSection
          title="User Persona"
          icon={<Users className="h-4 w-4" />}
          options={mockData.userPersona}
          selectedValues={config.audienceFilters.userPersona}
          onToggle={(value) => toggleSelection("userPersona", value)}
          description="Contractor role or persona type"
        />

        <FilterSection
          title="Contractor Tier"
          icon={<CreditCard className="h-4 w-4" />}
          options={mockData.contractorTier}
          selectedValues={config.audienceFilters.contractorTier}
          onToggle={(value) => toggleSelection("contractorTier", value)}
          description="Contractor classification level"
        />
      </div>

      {/* Summary */}
      <Card className="border-border shadow-enterprise bg-accent/30">
        <CardHeader>
          <CardTitle className="text-base">Audience Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-foreground">{getEstimatedUsers().toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Estimated Eligible Contractors</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {Object.values(config.audienceFilters).flat().length}
              </p>
              <p className="text-sm text-muted-foreground">Total Filters Applied</p>
            </div>
          </div>
          
          {Object.values(config.audienceFilters).every(arr => arr.length === 0) && (
            <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning-foreground">
                <strong>All India Targeting:</strong> No filters applied - targeting all contractors nationwide
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AudienceFilters;