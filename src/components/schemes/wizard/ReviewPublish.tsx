import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CheckCircle, Lock, MapPin, Package, Target, Trophy, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { SchemeConfig } from "../SchemeWizard";

interface ReviewPublishProps {
  config: SchemeConfig;
  onPublish: () => void;
}

const ReviewPublish: React.FC<ReviewPublishProps> = ({ config, onPublish }) => {
  const [confirmChecks, setConfirmChecks] = useState({
    reviewedConfig: false,
    understoodLock: false,
    budgetApproved: false,
    stakeholderNotified: false
  });

  const allChecksComplete = Object.values(confirmChecks).every(Boolean);

  const updateCheck = (key: keyof typeof confirmChecks, checked: boolean) => {
    setConfirmChecks(prev => ({ ...prev, [key]: checked }));
  };

  const getEstimatedImpact = () => {
    // Mock calculations based on config
    let participants = 15000;
    let qualifiedRate = 0.3;
    let avgReward = 2500;

    if (config.type === "Top Performers") {
      participants = 15000;
      qualifiedRate = (config.rewardLogic.maxWinners || 100) / participants;
      avgReward = 5000;
    } else if (config.type === "Product Category + Slab") {
      participants = 12000;
      qualifiedRate = 0.4;
      avgReward = 3200;
    } else if (config.type === "Bundles") {
      participants = 8000;
      qualifiedRate = 0.25;
      avgReward = 1800;
    }

    const qualified = Math.round(participants * qualifiedRate);
    const totalCost = qualified * avgReward;

    return { participants, qualified, avgReward, totalCost };
  };

  const impact = getEstimatedImpact();

  const renderBasicDetails = () => (
    <Card className="border-border shadow-enterprise">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Basic Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Scheme Name</p>
            <p className="font-medium">{config.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Type</p>
            <Badge variant="outline">{config.type}</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Start Date</p>
            <p className="font-medium">
              {config.startDate ? format(config.startDate, "MMM dd, yyyy") : "Not set"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">End Date</p>
            <p className="font-medium">
              {config.endDate ? format(config.endDate, "MMM dd, yyyy") : "Not set"}
            </p>
          </div>
        </div>
        
        {config.description && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Description</p>
            <p className="text-sm">{config.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderAudienceDetails = () => {
    const filters = config.audienceFilters;
    const hasFilters = Object.values(filters).some(arr => arr.length > 0);
    
    return (
      <Card className="border-border shadow-enterprise">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Target Audience
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasFilters ? (
            <div className="space-y-4">
              {filters.zones.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Zones</p>
                  <div className="flex flex-wrap gap-1">
                    {filters.zones.map(zone => (
                      <Badge key={zone} variant="secondary">{zone}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {filters.regions.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Regions</p>
                  <div className="flex flex-wrap gap-1">
                    {filters.regions.map(region => (
                      <Badge key={region} variant="secondary">{region}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {filters.contractorTier.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Contractor Tiers</p>
                  <div className="flex flex-wrap gap-1">
                    {filters.contractorTier.map(tier => (
                      <Badge key={tier} variant="secondary">{tier}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {filters.pincodes.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Pincodes</p>
                  <Badge variant="outline">{filters.pincodes.length} pincodes selected</Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="font-medium">All India Targeting</p>
              <p className="text-sm text-muted-foreground">No geographic filters applied</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderProductScope = () => (
    <Card className="border-border shadow-enterprise">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Package className="h-5 w-5" />
          Product Scope
        </CardTitle>
      </CardHeader>
      <CardContent>
        {config.productScope.enabled ? (
          <div className="space-y-3">
            <Badge variant="default">Product Filtering Enabled</Badge>
            
            {config.productScope.selectedCategories.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Categories</p>
                <div className="flex flex-wrap gap-1">
                  {config.productScope.selectedCategories.map(category => (
                    <Badge key={category} variant="secondary">{category}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {config.productScope.selectedSKUs.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Individual SKUs</p>
                <Badge variant="outline">{config.productScope.selectedSKUs.length} SKUs selected</Badge>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="font-medium">All Products Included</p>
            <p className="text-sm text-muted-foreground">No product filtering applied</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderRewardLogic = () => (
    <Card className="border-border shadow-enterprise">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {config.type === "Top Performers" && <Trophy className="h-5 w-5" />}
          {config.type === "Product Category + Slab" && <Target className="h-5 w-5" />}
          {config.type === "Bundles" && <Package className="h-5 w-5" />}
          Reward Logic
        </CardTitle>
      </CardHeader>
      <CardContent>
        {config.type === "Top Performers" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Max Winners</p>
                <p className="font-medium">{config.rewardLogic.maxWinners}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bonus Multiplier</p>
                <p className="font-medium">{config.rewardLogic.multiplier}x</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Top {config.rewardLogic.maxWinners} contractors by points will receive{" "}
              {((config.rewardLogic.multiplier || 1) - 1) * 100}% bonus
            </p>
          </div>
        )}
        
        {config.type === "Product Category + Slab" && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Slab Configuration ({config.rewardLogic.slabs?.length || 0} slabs)
            </p>
            {config.rewardLogic.slabs?.map((slab, index) => (
              <div key={slab.id} className="flex items-center justify-between p-2 bg-accent/30 rounded">
                <span className="text-sm">{slab.label}</span>
                <div className="text-sm">
                  {slab.lowerBound.toLocaleString()} - {slab.upperBound ? slab.upperBound.toLocaleString() : "∞"} pts
                  → +{slab.bonus.toLocaleString()} pts
                </div>
              </div>
            ))}
          </div>
        )}
        
        {config.type === "Bundles" && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Bundle Configuration ({config.rewardLogic.bundles?.length || 0} bundles)
            </p>
            {config.rewardLogic.bundles?.map((bundle) => (
              <div key={bundle.id} className="flex items-center justify-between p-2 bg-accent/30 rounded">
                <span className="text-sm font-medium">{bundle.name}</span>
                <div className="text-sm">
                  {bundle.skus.length} SKUs → +{bundle.bonus.toLocaleString()} pts
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Review & Publish</h2>
        <p className="text-muted-foreground">
          Review your complete scheme configuration before publishing
        </p>
      </div>

      {/* Impact Summary */}
      <Card className="border-border shadow-enterprise bg-gradient-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-lg">Estimated Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-bold">{impact.participants.toLocaleString()}</p>
              <p className="text-sm opacity-90">Est. Participants</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{impact.qualified.toLocaleString()}</p>
              <p className="text-sm opacity-90">Expected Qualifiers</p>
            </div>
            <div>
              <p className="text-2xl font-bold">₹{impact.avgReward.toLocaleString()}</p>
              <p className="text-sm opacity-90">Avg. Reward</p>
            </div>
            <div>
              <p className="text-2xl font-bold">₹{Math.round(impact.totalCost / 100000)}L</p>
              <p className="text-sm opacity-90">Est. Total Cost</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderBasicDetails()}
        {renderAudienceDetails()}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderProductScope()}
        {renderRewardLogic()}
      </div>

      {/* Pre-publish Checklist */}
      <Card className="border-border shadow-enterprise">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Pre-Launch Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="review-config"
                checked={confirmChecks.reviewedConfig}
                onCheckedChange={(checked) => updateCheck("reviewedConfig", checked as boolean)}
              />
              <Label htmlFor="review-config" className="text-sm">
                I have reviewed the complete scheme configuration above
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="understand-lock"
                checked={confirmChecks.understoodLock}
                onCheckedChange={(checked) => updateCheck("understoodLock", checked as boolean)}
              />
              <Label htmlFor="understand-lock" className="text-sm">
                I understand that published schemes are <strong>locked</strong> and require cloning to modify
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="budget-approved"
                checked={confirmChecks.budgetApproved}
                onCheckedChange={(checked) => updateCheck("budgetApproved", checked as boolean)}
              />
              <Label htmlFor="budget-approved" className="text-sm">
                Budget approval obtained for estimated cost of ₹{Math.round(impact.totalCost / 100000)}L
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="stakeholder-notified"
                checked={confirmChecks.stakeholderNotified}
                onCheckedChange={(checked) => updateCheck("stakeholderNotified", checked as boolean)}
              />
              <Label htmlFor="stakeholder-notified" className="text-sm">
                Relevant stakeholders have been notified of the scheme launch
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publish Actions */}
      <Card className="border-border shadow-enterprise">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Ready to Publish?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Once published, the scheme will be active and configuration will be locked
              </p>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={!allChecksComplete}
                  className="bg-gradient-primary shadow-glass"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Publish Scheme
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Scheme Publication</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>
                      You are about to publish "{config.name}" which will:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Make the scheme active immediately</li>
                      <li>Lock the configuration (no further edits allowed)</li>
                      <li>Begin contractor eligibility evaluation</li>
                      <li>Start the reward calculation process</li>
                    </ul>
                    <p className="font-medium text-foreground mt-3">
                      This action cannot be undone. You will need to clone the scheme to make changes.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onPublish}>
                    Yes, Publish Scheme
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewPublish;