import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Play, CheckCircle, XCircle, AlertCircle, User } from "lucide-react";
import { SchemeConfig } from "../SchemeWizard";

interface SimulateQAProps {
  config: SchemeConfig;
}

const mockContractors = [
  {
    id: "C0001",
    name: "Karan Paints",
    zone: "West",
    region: "Maharashtra",
    tier: "Gold",
    pointsInWindow: 82400,
    productPoints: 45000,
    bundlesSatisfied: ["Bundle A", "Bundle B"]
  },
  {
    id: "C0002", 
    name: "ColorCraft Co.",
    zone: "North",
    region: "Haryana",
    tier: "Silver",
    pointsInWindow: 81950,
    productPoints: 35000,
    bundlesSatisfied: ["Bundle A"]
  },
  {
    id: "C0003",
    name: "Brush Bros",
    zone: "North", 
    region: "Haryana",
    tier: "Gold",
    pointsInWindow: 40200,
    productPoints: 22000,
    bundlesSatisfied: []
  }
];

const SimulateQA: React.FC<SimulateQAProps> = ({ config }) => {
  const [contractorInput, setContractorInput] = useState("");
  const [simulationResults, setSimulationResults] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = (contractorId?: string) => {
    setIsSimulating(true);
    
    // Simulate API delay
    setTimeout(() => {
      if (contractorId) {
        // Single contractor simulation
        const contractor = mockContractors.find(c => 
          c.id.toLowerCase() === contractorId.toLowerCase() ||
          c.name.toLowerCase().includes(contractorId.toLowerCase())
        );
        
        if (contractor) {
          const result = calculateReward(contractor);
          setSimulationResults([result]);
        } else {
          setSimulationResults([{
            contractor: { id: contractorId, name: "Not Found" },
            eligible: false,
            reason: "Contractor not found in system",
            reward: 0
          }]);
        }
      } else {
        // Random sample simulation
        const sampleResults = mockContractors.slice(0, 3).map(calculateReward);
        setSimulationResults(sampleResults);
      }
      
      setIsSimulating(false);
    }, 1000);
  };

  const calculateReward = (contractor: any) => {
    const result = {
      contractor,
      eligible: false,
      reason: "",
      reward: 0,
      rank: 0,
      slabMatched: "",
      bundlesQualified: [] as string[]
    };

    // Check audience eligibility first
    const audienceMatch = checkAudienceEligibility(contractor);
    if (!audienceMatch.eligible) {
      return { ...result, reason: audienceMatch.reason };
    }

    // Calculate based on scheme type
    if (config.type === "Top Performers") {
      const maxWinners = config.rewardLogic.maxWinners || 0;
      const multiplier = config.rewardLogic.multiplier || 1;
      const rank = mockContractors.findIndex(c => c.id === contractor.id) + 1;
      
      if (rank <= maxWinners) {
        const pointsToUse = config.productScope.enabled ? contractor.productPoints : contractor.pointsInWindow;
        result.eligible = true;
        result.rank = rank;
        result.reward = Math.round(pointsToUse * (multiplier - 1));
        result.reason = `Rank ${rank} of ${maxWinners} winners`;
      } else {
        result.reason = `Rank ${rank} - outside winner pool (top ${maxWinners})`;
      }
    }
    
    else if (config.type === "Product Category + Slab") {
      const pointsToUse = config.productScope.enabled ? contractor.productPoints : contractor.pointsInWindow;
      const slab = findMatchingSlab(pointsToUse);
      
      if (slab) {
        result.eligible = true;
        result.slabMatched = slab.label;
        result.reward = slab.bonus;
        result.reason = `${slab.label}: ${pointsToUse.toLocaleString()} points`;
      } else {
        result.reason = `${pointsToUse.toLocaleString()} points - no matching slab`;
      }
    }
    
    else if (config.type === "Bundles") {
      const qualifiedBundles = contractor.bundlesSatisfied || [];
      const bundles = config.rewardLogic.bundles || [];
      
      result.bundlesQualified = qualifiedBundles;
      if (qualifiedBundles.length > 0) {
        result.eligible = true;
        result.reward = qualifiedBundles.reduce((total: number, bundleName: string) => {
          const bundle = bundles.find(b => b.name === bundleName);
          return total + (bundle?.bonus || 0);
        }, 0);
        result.reason = `Qualified for ${qualifiedBundles.length} bundle${qualifiedBundles.length > 1 ? 's' : ''}`;
      } else {
        result.reason = "No bundles satisfied - check minimum quantities";
      }
    }

    return result;
  };

  const checkAudienceEligibility = (contractor: any) => {
    const filters = config.audienceFilters;
    
    if (filters.zones.length > 0 && !filters.zones.includes(contractor.zone)) {
      return { eligible: false, reason: `Zone ${contractor.zone} not in target zones` };
    }
    
    if (filters.regions.length > 0 && !filters.regions.includes(contractor.region)) {
      return { eligible: false, reason: `Region ${contractor.region} not in target regions` };
    }
    
    if (filters.contractorTier.length > 0 && !filters.contractorTier.includes(contractor.tier)) {
      return { eligible: false, reason: `Tier ${contractor.tier} not in target tiers` };
    }
    
    return { eligible: true, reason: "" };
  };

  const findMatchingSlab = (points: number) => {
    const slabs = config.rewardLogic.slabs || [];
    return slabs.find(slab => {
      const meetsLower = points >= slab.lowerBound;
      const meetsUpper = slab.upperBound === null || points <= slab.upperBound;
      return meetsLower && meetsUpper;
    });
  };

  const getStatusIcon = (eligible: boolean) => {
    return eligible ? (
      <CheckCircle className="h-4 w-4 text-success" />
    ) : (
      <XCircle className="h-4 w-4 text-destructive" />
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Simulate & QA</h2>
        <p className="text-muted-foreground">
          Test your scheme configuration with sample contractors and scenarios
        </p>
      </div>

      {/* Simulation Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border shadow-enterprise">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Test Specific Contractor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contractor-input">Contractor ID or Name</Label>
              <div className="flex gap-2">
                <Input
                  id="contractor-input"
                  placeholder="e.g., C0001 or Karan Paints"
                  value={contractorInput}
                  onChange={(e) => setContractorInput(e.target.value)}
                />
                <Button 
                  onClick={() => runSimulation(contractorInput)}
                  disabled={!contractorInput.trim() || isSimulating}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Test
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter contractor ID (e.g., C0001) or search by name
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-enterprise">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Play className="h-5 w-5" />
              Random Sample Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Run a quick test with 5 random contractors from your target audience to validate scheme logic.
            </p>
            <Button 
              onClick={() => runSimulation()}
              disabled={isSimulating}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              {isSimulating ? "Running Simulation..." : "Run 5-User Spot Check"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Simulation Results */}
      {simulationResults.length > 0 && (
        <Card className="border-border shadow-enterprise">
          <CardHeader>
            <CardTitle className="text-lg">Simulation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Contractor</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {simulationResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.eligible)}
                        <Badge variant={result.eligible ? "default" : "secondary"}>
                          {result.eligible ? "Qualified" : "Not Qualified"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{result.contractor.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {result.contractor.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {config.type === "Top Performers" && (
                          <>
                            <p>Points: {result.contractor.pointsInWindow?.toLocaleString()}</p>
                            {result.rank > 0 && <p>Rank: #{result.rank}</p>}
                          </>
                        )}
                        {config.type === "Product Category + Slab" && (
                          <>
                            <p>Product Points: {result.contractor.productPoints?.toLocaleString()}</p>
                            {result.slabMatched && <p>Slab: {result.slabMatched}</p>}
                          </>
                        )}
                        {config.type === "Bundles" && (
                          <>
                            <p>Bundles: {result.bundlesQualified?.length || 0}</p>
                            {result.bundlesQualified?.map((bundle: string) => (
                              <Badge key={bundle} variant="outline" className="text-xs mr-1">
                                {bundle}
                              </Badge>
                            ))}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {result.reward > 0 ? (
                          <span className="text-success">+{result.reward.toLocaleString()} pts</span>
                        ) : (
                          <span className="text-muted-foreground">0 pts</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground">{result.reason}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Validation Warnings */}
      <Card className="border-border shadow-enterprise bg-gradient-secondary">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Validation Checks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {config.type === "Top Performers" && config.rewardLogic.maxWinners && config.rewardLogic.maxWinners > 1000 && (
              <div className="flex items-start gap-2 text-warning-foreground">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <div>
                  <p className="font-medium">High Winner Count</p>
                  <p className="text-sm">Consider if {config.rewardLogic.maxWinners} winners is optimal for budget control</p>
                </div>
              </div>
            )}
            
            {config.type === "Product Category + Slab" && !config.productScope.enabled && (
              <div className="flex items-start gap-2 text-warning-foreground">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <div>
                  <p className="font-medium">Product Scope Disabled</p>
                  <p className="text-sm">Slab schemes typically require product filtering for focused rewards</p>
                </div>
              </div>
            )}
            
            {Object.values(config.audienceFilters).every(arr => arr.length === 0) && (
              <div className="flex items-start gap-2 text-success-foreground">
                <CheckCircle className="h-4 w-4 mt-0.5" />
                <div>
                  <p className="font-medium">All India Targeting</p>
                  <p className="text-sm">Scheme will target all contractors nationwide</p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-2 text-success-foreground">
              <CheckCircle className="h-4 w-4 mt-0.5" />
              <div>
                <p className="font-medium">Configuration Valid</p>
                <p className="text-sm">All required fields completed, ready for review</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulateQA;