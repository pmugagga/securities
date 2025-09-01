/*
  # Fix investor leads RLS policies

  1. Security Changes
    - Temporarily disable RLS on investor_leads table
    - Drop all existing policies to ensure clean state
    - Re-enable RLS with correct policies
    - Allow anonymous users to insert leads
    - Allow authenticated users to manage leads

  2. Policy Details
    - INSERT: Allow both anonymous and authenticated users
    - SELECT: Allow authenticated users only (for admin panel)
    - UPDATE/DELETE: Allow authenticated users only
*/

-- Disable RLS temporarily
ALTER TABLE investor_leads DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public to submit investor leads" ON investor_leads;
DROP POLICY IF EXISTS "Authenticated users can view all investor leads" ON investor_leads;
DROP POLICY IF EXISTS "Authenticated users can update investor leads" ON investor_leads;
DROP POLICY IF EXISTS "Authenticated users can delete investor leads" ON investor_leads;

-- Re-enable RLS
ALTER TABLE investor_leads ENABLE ROW LEVEL SECURITY;

-- Create new policies with correct permissions
CREATE POLICY "Public can submit investor leads"
  ON investor_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view investor leads"
  ON investor_leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update investor leads"
  ON investor_leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete investor leads"
  ON investor_leads
  FOR DELETE
  TO authenticated
  USING (true);