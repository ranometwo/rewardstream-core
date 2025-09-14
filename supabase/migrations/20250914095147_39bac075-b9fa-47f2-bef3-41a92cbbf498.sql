-- Create datasets table for schema-on-arrival datasets
CREATE TABLE public.datasets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('event_data', 'user_data', 'product_data', 'other')),
  description TEXT,
  custom_category_label TEXT, -- for 'other' category
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_archived BOOLEAN DEFAULT false
);

-- Create dataset versions table for immutable versioning
CREATE TABLE public.dataset_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID NOT NULL REFERENCES public.datasets(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT false,
  row_count INTEGER DEFAULT 0,
  file_size_bytes BIGINT DEFAULT 0,
  schema_hash TEXT, -- hash of column structure for drift detection
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  activated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(dataset_id, version_number)
);

-- Create import runs table for tracking each upload session
CREATE TABLE public.import_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID NOT NULL REFERENCES public.datasets(id) ON DELETE CASCADE,
  target_version_id UUID REFERENCES public.dataset_versions(id), -- for append/upsert
  new_version_id UUID REFERENCES public.dataset_versions(id), -- for replace
  import_mode TEXT NOT NULL CHECK (import_mode IN ('append', 'upsert', 'replace')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'uploading', 'profiling', 'mapping', 'validating', 'processing', 'completed', 'failed')),
  file_name TEXT NOT NULL,
  file_path TEXT, -- storage path
  file_size_bytes BIGINT,
  delimiter TEXT DEFAULT ',',
  encoding TEXT DEFAULT 'UTF-8',
  header_row INTEGER DEFAULT 1,
  total_rows INTEGER,
  processed_rows INTEGER DEFAULT 0,
  inserted_rows INTEGER DEFAULT 0,
  updated_rows INTEGER DEFAULT 0,
  skipped_rows INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  validation_passed BOOLEAN,
  started_by UUID REFERENCES auth.users(id),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Create columns profiled table for dynamic schema discovery
CREATE TABLE public.columns_profiled (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  import_run_id UUID NOT NULL REFERENCES public.import_runs(id) ON DELETE CASCADE,
  column_name TEXT NOT NULL,
  column_index INTEGER NOT NULL,
  suggested_type TEXT NOT NULL CHECK (suggested_type IN ('string', 'number', 'date', 'boolean')),
  confidence_level TEXT NOT NULL CHECK (confidence_level IN ('high', 'medium', 'low')),
  null_percentage DECIMAL(5,2),
  distinct_count INTEGER,
  sample_values JSONB, -- array of sample values
  pattern_analysis JSONB, -- regex patterns, format detection etc
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mappings table for PK/FK relationships and transformations
CREATE TABLE public.mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  import_run_id UUID NOT NULL REFERENCES public.import_runs(id) ON DELETE CASCADE,
  source_column TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('primary_key', 'foreign_key', 'attribute')),
  target_dataset_id UUID REFERENCES public.datasets(id),
  target_column TEXT,
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  coverage_percentage DECIMAL(5,2), -- for FK relationships
  is_manual_override BOOLEAN DEFAULT false,
  transforms JSONB, -- array of transform operations
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create validation rules table for column-specific validation
CREATE TABLE public.validation_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID NOT NULL REFERENCES public.datasets(id) ON DELETE CASCADE,
  column_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('required', 'unique', 'type', 'format', 'range', 'regex', 'foreign_key')),
  rule_config JSONB NOT NULL, -- rule parameters
  is_enabled BOOLEAN DEFAULT true,
  severity TEXT NOT NULL DEFAULT 'error' CHECK (severity IN ('error', 'warning')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(dataset_id, column_name, rule_type)
);

-- Create data quality issues table for tracking validation failures
CREATE TABLE public.dq_issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  import_run_id UUID NOT NULL REFERENCES public.import_runs(id) ON DELETE CASCADE,
  row_number INTEGER NOT NULL,
  column_name TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('error', 'warning')),
  issue_description TEXT NOT NULL,
  sample_value TEXT,
  fix_suggestion TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create relations table for tracking dataset relationships
CREATE TABLE public.relations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_dataset_id UUID NOT NULL REFERENCES public.datasets(id) ON DELETE CASCADE,
  source_column TEXT NOT NULL,
  target_dataset_id UUID NOT NULL REFERENCES public.datasets(id) ON DELETE CASCADE,
  target_column TEXT NOT NULL,
  cardinality TEXT CHECK (cardinality IN ('one_to_one', 'one_to_many', 'many_to_one', 'many_to_many')),
  coverage_percentage DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(source_dataset_id, source_column, target_dataset_id, target_column)
);

-- Enable RLS on all tables
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dataset_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.columns_profiled ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dq_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Users can view all datasets" ON public.datasets FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can create datasets" ON public.datasets FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());
CREATE POLICY "Users can update their datasets" ON public.datasets FOR UPDATE USING (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "Users can view all dataset versions" ON public.dataset_versions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can create dataset versions" ON public.dataset_versions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "Users can view all import runs" ON public.import_runs FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can create import runs" ON public.import_runs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND started_by = auth.uid());
CREATE POLICY "Users can update their import runs" ON public.import_runs FOR UPDATE USING (auth.uid() IS NOT NULL AND started_by = auth.uid());

CREATE POLICY "Users can view all columns profiled" ON public.columns_profiled FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can create columns profiled" ON public.columns_profiled FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view all mappings" ON public.mappings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can create mappings" ON public.mappings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update mappings" ON public.mappings FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view all validation rules" ON public.validation_rules FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can create validation rules" ON public.validation_rules FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());
CREATE POLICY "Users can update their validation rules" ON public.validation_rules FOR UPDATE USING (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "Users can view all dq issues" ON public.dq_issues FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can create dq issues" ON public.dq_issues FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view all relations" ON public.relations FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can create relations" ON public.relations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update relations" ON public.relations FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('dataset-uploads', 'dataset-uploads', false);

-- Create storage policies for dataset uploads
CREATE POLICY "Users can upload their own files" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'dataset-uploads' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own files" ON storage.objects FOR SELECT USING (
  bucket_id = 'dataset-uploads' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own files" ON storage.objects FOR DELETE USING (
  bucket_id = 'dataset-uploads' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at columns
CREATE TRIGGER update_datasets_updated_at BEFORE UPDATE ON public.datasets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_datasets_category ON public.datasets(category);
CREATE INDEX idx_dataset_versions_dataset_id ON public.dataset_versions(dataset_id);
CREATE INDEX idx_dataset_versions_is_active ON public.dataset_versions(is_active) WHERE is_active = true;
CREATE INDEX idx_import_runs_dataset_id ON public.import_runs(dataset_id);
CREATE INDEX idx_import_runs_status ON public.import_runs(status);
CREATE INDEX idx_columns_profiled_import_run_id ON public.columns_profiled(import_run_id);
CREATE INDEX idx_mappings_import_run_id ON public.mappings(import_run_id);
CREATE INDEX idx_validation_rules_dataset_id ON public.validation_rules(dataset_id);
CREATE INDEX idx_dq_issues_import_run_id ON public.dq_issues(import_run_id);
CREATE INDEX idx_relations_source_dataset ON public.relations(source_dataset_id);
CREATE INDEX idx_relations_target_dataset ON public.relations(target_dataset_id);