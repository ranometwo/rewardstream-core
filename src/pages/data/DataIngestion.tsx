import { useState } from 'react';
import Layout from "@/components/Layout";
import { ImportWizard } from "@/components/data-ingestion/ImportWizard";
import { DataIngestionHistory } from "@/components/data-ingestion/DataIngestionHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Upload, History, Plus } from "lucide-react";

const DataIngestion = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [showNewImport, setShowNewImport] = useState(false);

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Data Ingestion</h1>
              <p className="text-muted-foreground mt-2">
                Upload, validate, and map CSV datasets with enterprise-grade monitoring
              </p>
            </div>
            <Button onClick={() => {
              setActiveTab('upload');
              setShowNewImport(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              New Import
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import Data
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-0">
            <ImportWizard 
              onComplete={() => {
                console.log('Import completed');
                setActiveTab('history');
                setShowNewImport(false);
              }}
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-0">
            <DataIngestionHistory 
              onSelectRun={(run) => {
                console.log('Selected run:', run);
                // Could show details modal or navigate to detailed view
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DataIngestion;