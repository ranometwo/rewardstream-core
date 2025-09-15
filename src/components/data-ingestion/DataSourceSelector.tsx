import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  RefreshCw, 
  Plus, 
  Database, 
  BarChart3, 
  BookOpen, 
  Settings,
  Info,
  Layers,
  Target
} from "lucide-react";

interface DataSourceSelectorProps {
  config: any;
  updateConfig: (updates: any) => void;
}

export const DataSourceSelector = ({ config, updateConfig }: DataSourceSelectorProps) => {
  const loadStrategies = [
    {
      id: 'full_refresh',
      name: 'Full Refresh',
      description: 'Replace all existing data with new dataset',
      icon: RefreshCw,
      badge: 'Recommended',
      details: 'Truncates target table and loads all new data. Best for complete data refreshes.',
      useCases: ['Daily snapshots', 'Reference data updates', 'Complete data migrations']
    },
    {
      id: 'incremental',
      name: 'Incremental Load',
      description: 'Append only new records based on timestamp',
      icon: Plus,
      badge: 'Efficient',
      details: 'Adds only new records based on incremental key (timestamp, ID, etc.)',
      useCases: ['Event logs', 'Transaction data', 'Audit trails']
    },
    {
      id: 'upsert',
      name: 'Merge (Upsert)',
      description: 'Update existing records or insert new ones',
      icon: Layers,
      badge: 'Advanced',
      details: 'Matches on primary key - updates existing records, inserts new ones.',
      useCases: ['Customer profiles', 'Product catalogs', 'Slowly changing dimensions']
    }
  ];

  const dataCategories = [
    {
      id: 'transactional',
      name: 'Transactional Data',
      description: 'OLTP data, transactions, operational records',
      icon: Database,
      examples: ['Orders', 'Payments', 'User actions']
    },
    {
      id: 'analytical',
      name: 'Analytical Data', 
      description: 'OLAP data, aggregated metrics, KPIs',
      icon: BarChart3,
      examples: ['Revenue metrics', 'User behavior', 'Performance data']
    },
    {
      id: 'reference',
      name: 'Reference Data',
      description: 'Master data, lookup tables, configurations',
      icon: BookOpen,
      examples: ['Product catalog', 'Geographic data', 'Categories']
    },
    {
      id: 'operational',
      name: 'Operational Data',
      description: 'System logs, monitoring data, configurations',
      icon: Settings,
      examples: ['Application logs', 'System metrics', 'Config changes']
    }
  ];

  const availableTables = [
    { id: 'customers', name: 'customers', schema: 'public', records: '2.4M', lastUpdated: '2 hours ago' },
    { id: 'orders', name: 'orders', schema: 'public', records: '8.1M', lastUpdated: '1 hour ago' },
    { id: 'products', name: 'products', schema: 'public', records: '50K', lastUpdated: '1 day ago' },
    { id: 'events', name: 'user_events', schema: 'analytics', records: '120M', lastUpdated: '15 min ago' }
  ];

  return (
    <div className="space-y-8">
      {/* Load Strategy Selection */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <Label className="text-lg font-semibold">Load Strategy</Label>
        </div>
        
        <RadioGroup 
          value={config.strategy} 
          onValueChange={(strategy) => updateConfig({ strategy })}
          className="space-y-3"
        >
          {loadStrategies.map((strategy) => {
            const StrategyIcon = strategy.icon;
            const isSelected = config.strategy === strategy.id;
            
            return (
              <div 
                key={strategy.id}
                className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                  isSelected ? 'border-primary bg-primary/5 shadow-enterprise' : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value={strategy.id} id={strategy.id} className="sr-only" />
                <label htmlFor={strategy.id} className="cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-muted'}`}>
                      <StrategyIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{strategy.name}</h3>
                        {strategy.badge && (
                          <Badge variant={isSelected ? 'default' : 'outline'} className="text-xs">
                            {strategy.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{strategy.description}</p>
                      <p className="text-xs text-muted-foreground">{strategy.details}</p>
                      
                      {isSelected && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs font-medium text-foreground mb-1">Common Use Cases:</p>
                          <div className="flex flex-wrap gap-1">
                            {strategy.useCases.map(useCase => (
                              <Badge key={useCase} variant="secondary" className="text-xs">
                                {useCase}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              </div>
            );
          })}
        </RadioGroup>
      </div>

      {/* Target Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Destination Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="w-4 h-4" />
              Destination Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(config.strategy === 'incremental' || config.strategy === 'upsert') ? (
              <div className="space-y-3">
                <Label htmlFor="target-table">Target Table</Label>
                <Select value={config.targetTable} onValueChange={(value) => updateConfig({ targetTable: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select existing table..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTables.map(table => (
                      <SelectItem key={table.id} value={table.id}>
                        <div className="flex items-center justify-between w-full">
                          <span className="font-mono">{table.schema}.{table.name}</span>
                          <div className="flex items-center gap-2 ml-4">
                            <Badge variant="outline" className="text-xs">{table.records}</Badge>
                            <span className="text-xs text-muted-foreground">{table.lastUpdated}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-3">
                <Label htmlFor="table-name">New Table Name</Label>
                <Input
                  id="table-name"
                  value={config.newTableName}
                  onChange={(e) => updateConfig({ newTableName: e.target.value })}
                  placeholder="e.g., customer_data_2024"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Table will be created in the default schema: <code>public</code>
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <Label>Data Category</Label>
              <Select value={config.category} onValueChange={(category) => updateConfig({ category })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data category..." />
                </SelectTrigger>
                <SelectContent>
                  {dataCategories.map(category => {
                    const CategoryIcon = category.icon;
                    return (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="w-4 h-4" />
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-xs text-muted-foreground">{category.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={config.description}
                onChange={(e) => updateConfig({ description: e.target.value })}
                placeholder="Describe the purpose and contents of this dataset..."
                rows={3}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuration Summary */}
        <Card className="bg-gradient-secondary">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="w-4 h-4" />
              Configuration Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-card rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Load Strategy</span>
                  <Badge variant="outline">
                    {loadStrategies.find(s => s.id === config.strategy)?.name || 'Not selected'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {loadStrategies.find(s => s.id === config.strategy)?.description || 'Select a load strategy above'}
                </p>
              </div>

              <div className="p-4 bg-card rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Destination</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {config.targetTable || config.newTableName || 'Not configured'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {config.targetTable ? 'Updating existing table' : 'Creating new table'}
                </p>
              </div>

              {config.category && (
                <div className="p-4 bg-card rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Data Type</span>
                    <Badge variant="outline">
                      {dataCategories.find(c => c.id === config.category)?.name}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {dataCategories.find(c => c.id === config.category)?.examples.map(example => (
                      <Badge key={example} variant="secondary" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {config.strategy === 'upsert' && (
                <Alert className="bg-warning/10 border-warning/20">
                  <Info className="h-4 w-4 text-warning" />
                  <AlertDescription className="text-warning-foreground text-xs">
                    Merge operations require a primary key to be defined in the next step.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};