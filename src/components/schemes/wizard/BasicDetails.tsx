import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { SchemeConfig, SchemeType } from "../SchemeWizard";

interface BasicDetailsProps {
  config: SchemeConfig;
  updateConfig: (updates: Partial<SchemeConfig>) => void;
}

const BasicDetails: React.FC<BasicDetailsProps> = ({ config, updateConfig }) => {
  const handleTypeChange = (type: SchemeType) => {
    updateConfig({ 
      type,
      rewardLogic: {} // Reset reward logic when type changes
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Basic Details</h2>
        <p className="text-muted-foreground">
          Set up the fundamental parameters for your loyalty scheme
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <Card className="border-border shadow-enterprise">
            <CardHeader>
              <CardTitle className="text-lg">Scheme Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scheme-name">Scheme Name *</Label>
                <Input
                  id="scheme-name"
                  placeholder="e.g., Q4 Premium Paint Champions"
                  value={config.name}
                  onChange={(e) => updateConfig({ name: e.target.value })}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Choose a clear, descriptive name that contractors will recognize
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the scheme objectives and target audience..."
                  value={config.description}
                  onChange={(e) => updateConfig({ description: e.target.value })}
                  rows={3}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Scheme Type *</Label>
                <Select value={config.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Top Performers">
                      <div className="space-y-1">
                        <div className="font-medium">Top Performers (Percentage Bonus)</div>
                        <div className="text-xs text-muted-foreground">
                          Rank contractors by points, reward top performers with bonus multiplier
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="Product Category + Slab">
                      <div className="space-y-1">
                        <div className="font-medium">Product Category + Slab (Fixed Bonus)</div>
                        <div className="text-xs text-muted-foreground">
                          Fixed rewards based on point ranges from specific products
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="Bundles">
                      <div className="space-y-1">
                        <div className="font-medium">Bundles (Fixed Bonus per Bundle)</div>
                        <div className="text-xs text-muted-foreground">
                          Reward contractors for purchasing predefined product bundles
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="border-border shadow-enterprise">
            <CardHeader>
              <CardTitle className="text-lg">Schedule & Timing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !config.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {config.startDate ? format(config.startDate, "MMM dd, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={config.startDate || undefined}
                        onSelect={(date) => updateConfig({ startDate: date || null })}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !config.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {config.endDate ? format(config.endDate, "MMM dd, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={config.endDate || undefined}
                        onSelect={(date) => updateConfig({ endDate: date || null })}
                        disabled={(date) => date < (config.startDate || new Date())}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reward Timing</Label>
                <Select
                  value={config.rewardTiming}
                  onValueChange={(value: "End of scheme" | "Weekly" | "Monthly") =>
                    updateConfig({ rewardTiming: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="End of scheme">
                      <div className="space-y-1">
                        <div className="font-medium">End of scheme</div>
                        <div className="text-xs text-muted-foreground">
                          Rewards credited after scheme completion
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="Weekly">Weekly Payouts</SelectItem>
                    <SelectItem value="Monthly">Monthly Payouts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {config.startDate && config.endDate && (
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Duration</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.ceil((config.endDate.getTime() - config.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                    ({format(config.startDate, "MMM dd")} - {format(config.endDate, "MMM dd, yyyy")})
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="border-border shadow-enterprise bg-gradient-secondary">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                💡 Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {config.type === "Top Performers" && (
                  <>
                    <p>• Leaderboard schemes work best with 3-6 month durations</p>
                    <p>• Consider seasonal sales patterns for timing</p>
                    <p>• Top performer schemes typically reward 5-15% of participants</p>
                  </>
                )}
                {config.type === "Product Category + Slab" && (
                  <>
                    <p>• Slab schemes often align with quarterly business cycles</p>
                    <p>• Focus on specific product categories for better targeting</p>
                    <p>• Consider inventory cycles when setting duration</p>
                  </>
                )}
                {config.type === "Bundles" && (
                  <>
                    <p>• Bundle schemes work well for product launches</p>
                    <p>• Consider complementary products in your bundles</p>
                    <p>• Shorter durations (1-3 months) often more effective</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;