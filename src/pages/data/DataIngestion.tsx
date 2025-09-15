import { useState } from 'react';
import Layout from "@/components/Layout";
import { ImportWizard } from "@/components/data-ingestion/ImportWizard";
import { DataIngestionHistory } from "@/components/data-ingestion/DataIngestionHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Calendar, Package, Database, TrendingUp, Activity } from "lucide-react";

const DataIngestion = () => {
  const [showImportWizard, setShowImportWizard] = useState(false);
  const [activeDataType, setActiveDataType] = useState('user_data');

  const dataTypes = [
    {
      id: 'user_data',
      name: 'User Data',
      icon: Users,
      description: 'Customer profiles, demographics, preferences',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      iconColor: 'text-blue-500'
    },
    {
      id: 'event_data', 
      name: 'Event Data',
      icon: Activity,
      description: 'User interactions, behaviors, transactions',
      color: 'bg-green-50 border-green-200 text-green-700',
      iconColor: 'text-green-500'
    },
    {
      id: 'product_data',
      name: 'Product Catalog',
      icon: Package,
      description: 'Product information, inventory, pricing',
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      iconColor: 'text-purple-500'
    }
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Data Ingestion Platform</h1>
            <p className="text-muted-foreground text-sm">
              Enterprise-grade data import with validation and monitoring
            </p>
          </div>
          <Button onClick={() => setShowImportWizard(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Import
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">2.4M</div>
                <div className="text-xs text-muted-foreground">Total Records</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">47</div>
                <div className="text-xs text-muted-foreground">Imports Today</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">99.2%</div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">12.3s</div>
                <div className="text-xs text-muted-foreground">Avg Process Time</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Data Type Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dataTypes.map((type) => {
            const Icon = type.icon;
            const isActive = activeDataType === type.id;
            return (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-all ${
                  isActive ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
                }`}
                onClick={() => setActiveDataType(type.id)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Icon className={`w-5 h-5 ${type.iconColor}`} />
                    {type.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* History Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Import History - {dataTypes.find(t => t.id === activeDataType)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataIngestionHistory 
              dataType={activeDataType}
              onSelectRun={(run) => {
                console.log('Selected run:', run);
              }}
            />
          </CardContent>
        </Card>

        {/* Import Wizard Modal */}
        <Dialog open={showImportWizard} onOpenChange={setShowImportWizard}>
          <DialogContent className="max-w-[85vw] h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Data Import Wizard</DialogTitle>
            </DialogHeader>
            <ImportWizard 
              onComplete={() => {
                setShowImportWizard(false);
                // Refresh history
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default DataIngestion;