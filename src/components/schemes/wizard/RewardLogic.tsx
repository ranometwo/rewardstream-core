import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Trophy, Target, Package } from "lucide-react";
import { SchemeConfig } from "../SchemeWizard";

interface RewardLogicProps {
  config: SchemeConfig;
  updateConfig: (updates: Partial<SchemeConfig>) => void;
}

const RewardLogic: React.FC<RewardLogicProps> = ({ config, updateConfig }) => {
  const updateRewardLogic = (updates: any) => {
    updateConfig({
      rewardLogic: {
        ...config.rewardLogic,
        ...updates
      }
    });
  };

  const renderTopPerformersLogic = () => (
    <div className="space-y-6">
      <Card className="border-border shadow-enterprise">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Leaderboard Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-winners">Maximum Winners *</Label>
              <Input
                id="max-winners"
                type="number"
                min="2"
                placeholder="e.g., 100"
                value={config.rewardLogic.maxWinners || ""}
                onChange={(e) => updateRewardLogic({ maxWinners: parseInt(e.target.value) || undefined })}
              />
              <p className="text-xs text-muted-foreground">
                Top N contractors who will receive rewards
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="multiplier">Bonus Multiplier *</Label>
              <Input
                id="multiplier"
                type="number"
                step="0.1"
                min="1.1"
                placeholder="e.g., 1.2"
                value={config.rewardLogic.multiplier || ""}
                onChange={(e) => updateRewardLogic({ multiplier: parseFloat(e.target.value) || undefined })}
              />
              <p className="text-xs text-muted-foreground">
                Multiplier factor (e.g., 1.2 = 20% bonus)
              </p>
            </div>
          </div>

          {config.rewardLogic.maxWinners && config.rewardLogic.multiplier && (
            <div className="p-4 bg-accent/50 rounded-lg">
              <h4 className="font-medium mb-2">Reward Preview</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p>Max Winners: <strong>{config.rewardLogic.maxWinners}</strong></p>
                  <p>Bonus Rate: <strong>{((config.rewardLogic.multiplier - 1) * 100).toFixed(1)}%</strong></p>
                </div>
                <div>
                  <p>Example: 10,000 points → <strong>{(10000 * config.rewardLogic.multiplier).toLocaleString()} points</strong></p>
                  <p>Bonus earned: <strong>{(10000 * (config.rewardLogic.multiplier - 1)).toLocaleString()} points</strong></p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border shadow-enterprise bg-gradient-secondary">
        <CardHeader>
          <CardTitle className="text-lg">Ranking Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
              <div>
                <p className="font-medium">Ranking Basis</p>
                <p className="text-muted-foreground">Total loyalty points earned during scheme window</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
              <div>
                <p className="font-medium">Tie Handling</p>
                <p className="text-muted-foreground">All contractors tied at the cut-off rank are included</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
              <div>
                <p className="font-medium">Adjustments</p>
                <p className="text-muted-foreground">Net points considered (returns & cancellations adjusted)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSlabLogic = () => {
    const addSlab = () => {
      const newSlab = {
        id: Date.now().toString(),
        lowerBound: 0,
        upperBound: null,
        bonus: 0,
        label: `Slab ${(config.rewardLogic.slabs?.length || 0) + 1}`
      };
      updateRewardLogic({
        slabs: [...(config.rewardLogic.slabs || []), newSlab]
      });
    };

    const updateSlab = (id: string, updates: any) => {
      updateRewardLogic({
        slabs: config.rewardLogic.slabs?.map(slab =>
          slab.id === id ? { ...slab, ...updates } : slab
        )
      });
    };

    const removeSlab = (id: string) => {
      updateRewardLogic({
        slabs: config.rewardLogic.slabs?.filter(slab => slab.id !== id)
      });
    };

    return (
      <div className="space-y-6">
        <Card className="border-border shadow-enterprise">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Slab Definitions
              </CardTitle>
              <Button onClick={addSlab}>
                <Plus className="h-4 w-4 mr-2" />
                Add Slab
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {config.rewardLogic.slabs && config.rewardLogic.slabs.length > 0 ? (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Slab</TableHead>
                      <TableHead>Lower Bound (≥)</TableHead>
                      <TableHead>Upper Bound (≤)</TableHead>
                      <TableHead>Bonus Points</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {config.rewardLogic.slabs.map((slab, index) => (
                      <TableRow key={slab.id}>
                        <TableCell>
                          <Input
                            value={slab.label}
                            onChange={(e) => updateSlab(slab.id, { label: e.target.value })}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={slab.lowerBound}
                            onChange={(e) => updateSlab(slab.id, { lowerBound: parseInt(e.target.value) || 0 })}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          {index === config.rewardLogic.slabs!.length - 1 ? (
                            <Badge variant="outline">No Limit</Badge>
                          ) : (
                            <Input
                              type="number"
                              value={slab.upperBound || ""}
                              onChange={(e) => updateSlab(slab.id, { upperBound: parseInt(e.target.value) || null })}
                              className="w-24"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={slab.bonus}
                            onChange={(e) => updateSlab(slab.id, { bonus: parseInt(e.target.value) || 0 })}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSlab(slab.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="p-4 bg-accent/50 rounded-lg">
                  <h4 className="font-medium mb-2">Example Scenarios</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {config.rewardLogic.slabs.slice(0, 2).map((slab, index) => (
                      <div key={slab.id}>
                        <p>Contractor with <strong>{slab.lowerBound + 500}</strong> points</p>
                        <p className="text-muted-foreground">→ {slab.label}: +{slab.bonus} bonus points</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No slabs defined yet</p>
                <Button onClick={addSlab}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Slab
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-enterprise bg-gradient-secondary">
          <CardHeader>
            <CardTitle className="text-lg">Slab Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <p className="font-medium">Boundary Rule</p>
                  <p className="text-muted-foreground">Exact boundary values advance to the higher slab</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <p className="font-medium">Point Source</p>
                  <p className="text-muted-foreground">Only points from selected products count (if product scope enabled)</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <p className="font-medium">No Overlaps</p>
                  <p className="text-muted-foreground">Slabs cannot have overlapping ranges</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBundleLogic = () => {
    const addBundle = () => {
      const newBundle = {
        id: Date.now().toString(),
        name: `Bundle ${(config.rewardLogic.bundles?.length || 0) + 1}`,
        skus: [],
        bonus: 0
      };
      updateRewardLogic({
        bundles: [...(config.rewardLogic.bundles || []), newBundle]
      });
    };

    const updateBundle = (id: string, updates: any) => {
      updateRewardLogic({
        bundles: config.rewardLogic.bundles?.map(bundle =>
          bundle.id === id ? { ...bundle, ...updates } : bundle
        )
      });
    };

    const removeBundle = (id: string) => {
      updateRewardLogic({
        bundles: config.rewardLogic.bundles?.filter(bundle => bundle.id !== id)
      });
    };

    const addSKUToBundle = (bundleId: string) => {
      const bundle = config.rewardLogic.bundles?.find(b => b.id === bundleId);
      if (bundle) {
        updateBundle(bundleId, {
          skus: [...bundle.skus, { code: "", minQuantity: 1 }]
        });
      }
    };

    const updateBundleSKU = (bundleId: string, skuIndex: number, updates: any) => {
      const bundle = config.rewardLogic.bundles?.find(b => b.id === bundleId);
      if (bundle) {
        const updatedSKUs = bundle.skus.map((sku, index) =>
          index === skuIndex ? { ...sku, ...updates } : sku
        );
        updateBundle(bundleId, { skus: updatedSKUs });
      }
    };

    const removeSKUFromBundle = (bundleId: string, skuIndex: number) => {
      const bundle = config.rewardLogic.bundles?.find(b => b.id === bundleId);
      if (bundle) {
        updateBundle(bundleId, {
          skus: bundle.skus.filter((_, index) => index !== skuIndex)
        });
      }
    };

    return (
      <div className="space-y-6">
        <Card className="border-border shadow-enterprise">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Bundle Definitions
              </CardTitle>
              <Button onClick={addBundle}>
                <Plus className="h-4 w-4 mr-2" />
                Add Bundle
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {config.rewardLogic.bundles && config.rewardLogic.bundles.length > 0 ? (
              <div className="space-y-6">
                {config.rewardLogic.bundles.map((bundle) => (
                  <Card key={bundle.id} className="border">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Input
                            value={bundle.name}
                            onChange={(e) => updateBundle(bundle.id, { name: e.target.value })}
                            className="font-medium w-48"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label>Bonus Points:</Label>
                          <Input
                            type="number"
                            value={bundle.bonus}
                            onChange={(e) => updateBundle(bundle.id, { bonus: parseInt(e.target.value) || 0 })}
                            className="w-24"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBundle(bundle.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Required SKUs & Quantities</Label>
                          <Button
                            variant="outline"
                            onClick={() => addSKUToBundle(bundle.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add SKU
                          </Button>
                        </div>

                        {bundle.skus.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>SKU Code</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Min Quantity</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {bundle.skus.map((sku, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Input
                                      value={sku.code}
                                      onChange={(e) => updateBundleSKU(bundle.id, index, { code: e.target.value })}
                                      placeholder="SKU Code"
                                      className="font-mono"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <span className="text-sm text-muted-foreground">
                                      {sku.code ? "Auto-filled from catalog" : "Enter SKU code"}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={sku.minQuantity}
                                      onChange={(e) => updateBundleSKU(bundle.id, index, { minQuantity: parseInt(e.target.value) || 1 })}
                                      className="w-20"
                                      min="1"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">L</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeSKUFromBundle(bundle.id, index)}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-4 border rounded-lg border-dashed">
                            <p className="text-muted-foreground">No SKUs added to this bundle</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No bundles defined yet</p>
                <Button onClick={addBundle}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Bundle
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-enterprise bg-gradient-secondary">
          <CardHeader>
            <CardTitle className="text-lg">Bundle Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <p className="font-medium">Multiple Qualifications</p>
                  <p className="text-muted-foreground">Contractors can qualify for multiple bundles</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <p className="font-medium">Exact SKUs Only</p>
                  <p className="text-muted-foreground">No substitutions allowed - must match exact SKU codes</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <p className="font-medium">Independent Evaluation</p>
                  <p className="text-muted-foreground">Each bundle evaluated separately during scheme window</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Reward Logic</h2>
        <p className="text-muted-foreground">
          Configure how contractors qualify for rewards and calculate payouts
        </p>
      </div>

      {config.type === "Top Performers" && renderTopPerformersLogic()}
      {config.type === "Product Category + Slab" && renderSlabLogic()}
      {config.type === "Bundles" && renderBundleLogic()}
    </div>
  );
};

export default RewardLogic;