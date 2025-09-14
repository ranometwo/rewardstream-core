-- Fix RLS policies for datasets table to allow anonymous access for data ingestion
DROP POLICY IF EXISTS "Users can create datasets" ON public.datasets;
DROP POLICY IF EXISTS "Users can view all datasets" ON public.datasets;
DROP POLICY IF EXISTS "Users can update their datasets" ON public.datasets;

-- Allow anonymous users to create datasets for data ingestion
CREATE POLICY "Allow dataset creation" 
ON public.datasets 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Allow viewing all datasets
CREATE POLICY "Allow viewing datasets" 
ON public.datasets 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Allow updating datasets (for authenticated users only)
CREATE POLICY "Allow dataset updates" 
ON public.datasets 
FOR UPDATE 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow deleting datasets (for authenticated users only)
CREATE POLICY "Allow dataset deletion" 
ON public.datasets 
FOR DELETE 
TO authenticated
USING (auth.uid() IS NOT NULL);