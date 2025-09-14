import Layout from "@/components/Layout";
import { ImportWizard } from "@/components/data-ingestion/ImportWizard";

const DataIngestion = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Data Ingestion</h1>
          <p className="text-muted-foreground mt-2">
            Upload, validate, and map CSV datasets with schema-on-arrival discovery
          </p>
        </div>
        
        <ImportWizard 
          onComplete={() => {
            console.log('Import completed');
            // Handle completion - could navigate to data management or show success
          }}
        />
      </div>
    </Layout>
  );
};

export default DataIngestion;