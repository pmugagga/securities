/*
  # Reset and fix investor leads RLS policies

  1. Security Changes
    - Drop all existing policies on investor_leads table
    - Create new policy allowing public (anon and authenticated) to insert leads
    - Create policy allowing authenticated users to view all leads
    - Create policy allowing authenticated users to update leads
    - Create policy allowing authenticated users to delete leads

  2. Notes
    - This migration completely resets the RLS policies to ensure clean state
    - Public users can submit interest forms (INSERT)
    - Only authenticated users can manage leads (SELECT, UPDATE, DELETE)
*/

-- Drop all existing policies on investor_leads table
DROP POLICY IF EXISTS "Authenticated users can delete investor leads" ON investor_leads;
DROP POLICY IF EXISTS "Authenticated users can update investor leads" ON investor_leads;
DROP POLICY IF EXISTS "Authenticated users can view investor leads" ON investor_leads;
DROP POLICY IF EXISTS "Public can insert investor leads" ON investor_leads;

-- Ensure RLS is enabled
ALTER TABLE investor_leads ENABLE ROW LEVEL SECURITY;

-- Allow public (both anon and authenticated) to insert investor leads
CREATE POLICY "Allow public to submit investor leads"
  ON investor_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to view all investor leads
CREATE POLICY "Authenticated users can view all investor leads"
  ON investor_leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update investor leads
CREATE POLICY "Authenticated users can update investor leads"
  ON investor_leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete investor leads
CREATE POLICY "Authenticated users can delete investor leads"
  ON investor_leads
  FOR DELETE
  TO authenticated
  USING (true);