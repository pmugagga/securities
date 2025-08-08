export interface Security {
  id: string;
  type: 'government_bond' | 'treasury_bill';
  name: string;
  issuer: string;
  interestRate: number;
  minimumInvestment: number;
  maturityDate: string;
  duration: number; // in months
  yield: number;
  issuanceDate: string;
  status: 'active' | 'closed' | 'upcoming';
  description?: string;
  riskRating: 'low' | 'medium' | 'high';
}

export interface InvestorLead {
  id: string;
  securityId: string;
  fullName: string;
  email: string;
  phone: string;
  investmentAmount: number;
  selectedTenor: number;
  projectedReturns: number;
  createdAt: string;
  status: 'pending' | 'contacted' | 'converted';
}

export interface YieldCalculation {
  principal: number;
  tenor: number; // in months
  interestRate: number;
  totalReturns: number;
  netReturns: number;
  effectiveYield: number;
}

export interface FilterOptions {
  type: string;
  minDuration: number;
  maxDuration: number;
  minInterestRate: number;
  maxInterestRate: number;
  issuer: string;
  minInvestment: number;
  searchTerm: string;
}

export interface SortOption {
  field: 'yield' | 'duration' | 'interestRate' | 'minimumInvestment' | 'maturityDate';
  direction: 'asc' | 'desc';
}