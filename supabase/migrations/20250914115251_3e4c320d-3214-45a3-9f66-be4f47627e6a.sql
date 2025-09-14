-- Fix RLS policies for all data ingestion related tables to allow anonymous access

-- Import Runs table
DROP POLICY IF EXISTS "Users can create import runs" ON public.import_runs;
DROP POLICY IF EXISTS "Users can view all import runs" ON public.import_runs;
DROP POLICY IF EXISTS "Users can update their import runs" ON public.import_runs;

CREATE POLICY "Allow import run creation" ON public.import_runs FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow viewing import runs" ON public.import_runs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow import run updates" ON public.import_runs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Mappings table
DROP POLICY IF EXISTS "Users can create mappings" ON public.mappings;
DROP POLICY IF EXISTS "Users can view all mappings" ON public.mappings;
DROP POLICY IF EXISTS "Users can update mappings" ON public.mappings;

CREATE POLICY "Allow mapping creation" ON public.mappings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow viewing mappings" ON public.mappings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow mapping updates" ON public.mappings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- DQ Issues table
DROP POLICY IF EXISTS "Users can create dq issues" ON public.dq_issues;
DROP POLICY IF EXISTS "Users can view all dq issues" ON public.dq_issues;

CREATE POLICY "Allow dq issue creation" ON public.dq_issues FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow viewing dq issues" ON public.dq_issues FOR SELECT TO anon, authenticated USING (true);

-- Columns Profiled table
DROP POLICY IF EXISTS "Users can create columns profiled" ON public.columns_profiled;
DROP POLICY IF EXISTS "Users can view all columns profiled" ON public.columns_profiled;

CREATE POLICY "Allow columns profiled creation" ON public.columns_profiled FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow viewing columns profiled" ON public.columns_profiled FOR SELECT TO anon, authenticated USING (true);

-- Dataset Versions table
DROP POLICY IF EXISTS "Users can create dataset versions" ON public.dataset_versions;
DROP POLICY IF EXISTS "Users can view all dataset versions" ON public.dataset_versions;

CREATE POLICY "Allow dataset version creation" ON public.dataset_versions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow viewing dataset versions" ON public.dataset_versions FOR SELECT TO anon, authenticated USING (true);

-- Relations table
DROP POLICY IF EXISTS "Users can create relations" ON public.relations;
DROP POLICY IF EXISTS "Users can view all relations" ON public.relations;
DROP POLICY IF EXISTS "Users can update relations" ON public.relations;

CREATE POLICY "Allow relation creation" ON public.relations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow viewing relations" ON public.relations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow relation updates" ON public.relations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Validation Rules table
DROP POLICY IF EXISTS "Users can create validation rules" ON public.validation_rules;
DROP POLICY IF EXISTS "Users can view all validation rules" ON public.validation_rules;
DROP POLICY IF EXISTS "Users can update their validation rules" ON public.validation_rules;

CREATE POLICY "Allow validation rule creation" ON public.validation_rules FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow viewing validation rules" ON public.validation_rules FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow validation rule updates" ON public.validation_rules FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);