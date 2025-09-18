import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Package, Upload, X } from "lucide-react";
import { SchemeConfig } from "../SchemeWizard";

interface ProductScopeProps {
  config: SchemeConfig;
  updateConfig: (updates: Partial<SchemeConfig>) => void;
}

const mockSKUData = [
  {
    code: "100000000001",
    name: "Ever Wash 1L",
    group: "Topcoat",
    category: "Interior",
    subCategory: "Int. Paints Premium",
    subBrand: "Calista",
    packVolume: "1 L"
  },
  {
    code: "100000000234",
    name: "Calista One 4L",
    group: "Topcoat", 
    category: "Interior",
    subCategory: "Int. Paints Premium",
    subBrand: "One",
    packVolume: "4 L"
  },
  {
    code: "100000001111",
    name: "Calista Neo Star",
    group: "Topcoat",
    category: "Interior", 
    subCategory: "Int. Paints Premium",
    subBrand: "Calista",
    packVolume: "10 L"
  },
  {
    code: "100000002222",
    name: "Primer X",
    group: "Primer",
    category: "Interior",
    subCategory: "Int. Primer Std",
    subBrand: "—",
    packVolume: "10 L"
  },
  {
    code: "100000003333",
    name: "Exterior Emulsion",
    group: "Topcoat",
    category: "Exterior",
    subCategory: "Ext. Emulsion Std",
    subBrand: "—",
    packVolume: "20 L"
  }
];

const mockCategories = [
  { name: "Interior", subCategories: ["Int. Paints Premium", "Int. Paints Standard", "Int. Primer Std"] },
  { name: "Exterior", subCategories: ["Ext. Emulsion Std", "Ext. Primer Premium"] },
  { name: "Waterproofing", subCategories: ["Additive Std", "Coating Premium"] }
];

const ProductScope: React.FC<ProductScopeProps> = ({ config, updateConfig }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("categories");

  const updateProductScope = (updates: Partial<typeof config.productScope>) => {
    updateConfig({
      productScope: {
        ...config.productScope,
        ...updates
      }
    });
  };

  const toggleCategory = (category: string) => {
    const current = config.productScope.selectedCategories;
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    updateProductScope({ selectedCategories: updated });
  };

  const toggleSKU = (skuCode: string) => {
    const current = config.productScope.selectedSKUs;
    const updated = current.includes(skuCode)
      ? current.filter(s => s !== skuCode)
      : [...current, skuCode];
    updateProductScope({ selectedSKUs: updated });
  };

  const filteredSKUs = mockSKUData.filter(sku =>
    sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sku.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sku.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedCount = () => {
    return config.productScope.selectedCategories.length + config.productScope.selectedSKUs.length;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Product Scope</h2>
        <p className="text-muted-foreground">
          {config.type === "Product Category + Slab" 
            ? "Select products to include in point calculations (Required for slab schemes)"
            : "Optionally limit the scheme to specific products or categories"
          }
        </p>
      </div>

      {/* Enable/Disable Toggle */}
      <Card className="border-border shadow-enterprise">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Product Filtering</h3>
              <p className="text-sm text-muted-foreground">
                {config.productScope.enabled
                  ? "Only selected products will count towards point calculations"
                  : "All products will count towards point calculations"
                }
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="product-scope-toggle" className="text-sm">
                Filter by products
              </Label>
              <Switch
                id="product-scope-toggle"
                checked={config.productScope.enabled}
                onCheckedChange={(checked) => updateProductScope({ enabled: checked })}
              />
            </div>
          </div>
          
          {config.type === "Product Category + Slab" && !config.productScope.enabled && (
            <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning-foreground">
                <strong>Note:</strong> Slab schemes typically require product selection to focus rewards on specific categories
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {config.productScope.enabled && (
        <>
          {/* Selection Summary */}
          <Card className="border-border shadow-enterprise bg-accent/30">
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-bold text-foreground">{getSelectedCount()}</p>
                  <p className="text-sm text-muted-foreground">Items Selected</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{config.productScope.selectedCategories.length}</p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{config.productScope.selectedSKUs.length}</p>
                  <p className="text-sm text-muted-foreground">Individual SKUs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Selection */}
          <Card className="border-border shadow-enterprise">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  <TabsTrigger value="skus">Individual SKUs</TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="space-y-4">
                  <div className="space-y-3">
                    {mockCategories.map((category) => (
                      <Card key={category.name} className="border">
                        <CardContent className="pt-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <Checkbox
                              id={`category-${category.name}`}
                              checked={config.productScope.selectedCategories.includes(category.name)}
                              onCheckedChange={() => toggleCategory(category.name)}
                            />
                            <Label
                              htmlFor={`category-${category.name}`}
                              className="font-medium cursor-pointer"
                            >
                              {category.name}
                            </Label>
                            <Badge variant="outline" className="text-xs">
                              {category.subCategories.length} sub-categories
                            </Badge>
                          </div>
                          <div className="ml-6 flex flex-wrap gap-1">
                            {category.subCategories.map((sub) => (
                              <Badge key={sub} variant="secondary" className="text-xs">
                                {sub}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="skus" className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search SKUs by code or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Import CSV
                    </Button>
                  </div>

                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>SKU Code</TableHead>
                          <TableHead>Product Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Sub-Category</TableHead>
                          <TableHead>Pack Volume</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSKUs.map((sku) => (
                          <TableRow key={sku.code}>
                            <TableCell>
                              <Checkbox
                                checked={config.productScope.selectedSKUs.includes(sku.code)}
                                onCheckedChange={() => toggleSKU(sku.code)}
                              />
                            </TableCell>
                            <TableCell className="font-mono text-sm">{sku.code}</TableCell>
                            <TableCell className="font-medium">{sku.name}</TableCell>
                            <TableCell>{sku.category}</TableCell>
                            <TableCell>{sku.subCategory}</TableCell>
                            <TableCell>{sku.packVolume}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Selected Items Summary */}
          {getSelectedCount() > 0 && (
            <Card className="border-border shadow-enterprise">
              <CardHeader>
                <CardTitle className="text-lg">Selected Items</CardTitle>
              </CardHeader>
              <CardContent>
                {config.productScope.selectedCategories.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Categories ({config.productScope.selectedCategories.length}):</h4>
                    <div className="flex flex-wrap gap-1">
                      {config.productScope.selectedCategories.map((category) => (
                        <Badge key={category} variant="default" className="text-xs">
                          {category}
                          <button
                            onClick={() => toggleCategory(category)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {config.productScope.selectedSKUs.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Individual SKUs ({config.productScope.selectedSKUs.length}):</h4>
                    <div className="flex flex-wrap gap-1">
                      {config.productScope.selectedSKUs.map((sku) => {
                        const skuData = mockSKUData.find(s => s.code === sku);
                        return (
                          <Badge key={sku} variant="secondary" className="text-xs">
                            {skuData?.name || sku}
                            <button
                              onClick={() => toggleSKU(sku)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Tips based on scheme type */}
      <Card className="border-border shadow-enterprise bg-gradient-secondary">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            💡 Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {config.type === "Product Category + Slab" && (
              <>
                <p>• Focus on 1-3 related categories for maximum impact</p>
                <p>• Consider seasonal product performance when selecting</p>
                <p>• Ensure selected products have sufficient transaction volume</p>
              </>
            )}
            {config.type === "Top Performers" && (
              <>
                <p>• Product filtering is optional for leaderboard schemes</p>
                <p>• Consider focusing on premium or strategic products</p>
                <p>• Broader product scope increases participation</p>
              </>
            )}
            {config.type === "Bundles" && (
              <>
                <p>• Product selection will be done in bundle definitions</p>
                <p>• This filter applies additional constraints if needed</p>
                <p>• Usually best to leave this disabled for bundle schemes</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductScope;