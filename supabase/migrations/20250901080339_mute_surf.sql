/*
  # Update investor leads RLS policies

  1. Security Changes
    - Drop existing restrictive INSERT policy on investor_leads table
    - Create new policy allowing both anonymous and authenticated users to insert leads
    - Ensure public users can submit interest forms without authentication

  2. Policy Details
    - INSERT: Allow both 'anon' and 'authenticated' roles to create new leads
    - SELECT: Keep existing policy for authenticated users only
    - UPDATE/DELETE: Keep existing policies for authenticated users only
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Authenticated users can insert investor leads" ON investor_leads;

-- Create new policy that allows both anonymous and authenticated users to insert
CREATE POLICY "Public can insert investor leads"
  ON investor_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure the existing SELECT policy is correct for authenticated users
DROP POLICY IF EXISTS "Authenticated users can view investor leads" ON investor_leads;
CREATE POLICY "Authenticated users can view investor leads"
  ON investor_leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure UPDATE policy exists for authenticated users
DROP POLICY IF EXISTS "Authenticated users can update investor leads" ON investor_leads;
CREATE POLICY "Authenticated users can update investor leads"
  ON investor_leads
  FOR UPDATE
  TO authenticated
  USING (true);

-- Ensure DELETE policy exists for authenticated users
DROP POLICY IF EXISTS "Authenticated users can delete investor leads" ON investor_leads;
CREATE POLICY "Authenticated users can delete investor leads"
  ON investor_leads
  FOR DELETE
  TO authenticated
  USING (true);