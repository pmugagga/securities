/*
  # Fix investor leads RLS policy

  1. Security Changes
    - Update RLS policy to allow anonymous users to insert investor leads
    - This enables public users to express interest in securities without authentication
    - Maintains security by only allowing inserts, not reads/updates/deletes for anonymous users

  2. Policy Updates
    - Drop existing restrictive insert policy
    - Create new policy allowing public inserts for investor leads
*/

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can insert investor leads" ON investor_leads;

-- Create a new policy that allows anonymous users to insert leads
CREATE POLICY "Public can insert investor leads"
  ON investor_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure the existing policies for other operations remain intact
-- (authenticated users can still read, update, delete)