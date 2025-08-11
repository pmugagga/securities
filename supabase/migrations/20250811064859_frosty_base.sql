/*
  # Create securities and investor leads schema

  1. New Tables
    - `securities`
      - `id` (uuid, primary key)
      - `type` (text, government_bond or treasury_bill)
      - `name` (text)
      - `issuer` (text)
      - `interest_rate` (decimal)
      - `minimum_investment` (bigint)
      - `maturity_date` (date)
      - `duration` (integer, in months)
      - `yield` (decimal)
      - `issuance_date` (date)
      - `status` (text, active/closed/upcoming)
      - `description` (text)
      - `risk_rating` (text, low/medium/high)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `investor_leads`
      - `id` (uuid, primary key)
      - `security_id` (uuid, foreign key)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `investment_amount` (bigint)
      - `selected_tenor` (integer, in months)
      - `projected_returns` (bigint)
      - `status` (text, pending/contacted/converted)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access to securities
    - Add policies for authenticated users to manage data
*/

-- Create securities table
CREATE TABLE IF NOT EXISTS securities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('government_bond', 'treasury_bill')),
  name text NOT NULL,
  issuer text NOT NULL,
  interest_rate decimal(5,2) NOT NULL DEFAULT 0,
  minimum_investment bigint NOT NULL DEFAULT 0,
  maturity_date date NOT NULL,
  duration integer NOT NULL DEFAULT 0,
  yield decimal(5,2) NOT NULL DEFAULT 0,
  issuance_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'upcoming')),
  description text DEFAULT '',
  risk_rating text NOT NULL DEFAULT 'low' CHECK (risk_rating IN ('low', 'medium', 'high')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create investor leads table
CREATE TABLE IF NOT EXISTS investor_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  security_id uuid NOT NULL REFERENCES securities(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  investment_amount bigint NOT NULL DEFAULT 0,
  selected_tenor integer NOT NULL DEFAULT 0,
  projected_returns bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE securities ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_leads ENABLE ROW LEVEL SECURITY;

-- Create policies for securities (public read, authenticated write)
CREATE POLICY "Securities are viewable by everyone"
  ON securities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert securities"
  ON securities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update securities"
  ON securities
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete securities"
  ON securities
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for investor leads (authenticated access only)
CREATE POLICY "Authenticated users can view investor leads"
  ON investor_leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert investor leads"
  ON investor_leads
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update investor leads"
  ON investor_leads
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete investor leads"
  ON investor_leads
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_securities_type ON securities(type);
CREATE INDEX IF NOT EXISTS idx_securities_status ON securities(status);
CREATE INDEX IF NOT EXISTS idx_securities_maturity_date ON securities(maturity_date);
CREATE INDEX IF NOT EXISTS idx_investor_leads_security_id ON investor_leads(security_id);
CREATE INDEX IF NOT EXISTS idx_investor_leads_status ON investor_leads(status);
CREATE INDEX IF NOT EXISTS idx_investor_leads_created_at ON investor_leads(created_at);

-- Insert sample data
INSERT INTO securities (
  type, name, issuer, interest_rate, minimum_investment, maturity_date, 
  duration, yield, issuance_date, status, description, risk_rating
) VALUES
  (
    'government_bond',
    'Uganda Government Bond - 10 Year',
    'Bank of Uganda',
    16.5,
    50000,
    '2034-12-15',
    120,
    16.5,
    '2024-01-15',
    'active',
    'Long-term government bond with semi-annual coupon payments',
    'low'
  ),
  (
    'treasury_bill',
    '91-Day Treasury Bill',
    'Bank of Uganda',
    10.2,
    1000000,
    '2024-06-30',
    3,
    10.45,
    '2024-04-01',
    'active',
    'Short-term treasury bill with discount pricing',
    'low'
  ),
  (
    'treasury_bill',
    '182-Day Treasury Bill',
    'Bank of Uganda',
    12.8,
    1000000,
    '2024-09-15',
    6,
    13.1,
    '2024-03-15',
    'active',
    'Medium-term treasury bill with competitive yields',
    'low'
  ),
  (
    'government_bond',
    'Uganda Government Bond - 5 Year',
    'Bank of Uganda',
    15.2,
    50000,
    '2029-08-20',
    60,
    15.2,
    '2024-02-20',
    'active',
    'Medium-term government bond with quarterly coupon payments',
    'low'
  ),
  (
    'treasury_bill',
    '364-Day Treasury Bill',
    'Bank of Uganda',
    14.5,
    1000000,
    '2025-03-10',
    12,
    15.2,
    '2024-03-10',
    'active',
    'One-year treasury bill with attractive returns',
    'low'
  ),
  (
    'government_bond',
    'Uganda Government Bond - 15 Year',
    'Bank of Uganda',
    17.8,
    100000,
    '2039-11-30',
    180,
    17.8,
    '2024-01-30',
    'active',
    'Long-term bond for institutional and high-net-worth investors',
    'low'
  );