import { Security } from '../types';

export const mockSecurities: Security[] = [
  {
    id: '1',
    type: 'government_bond',
    name: 'Uganda Government Bond - 10 Year',
    issuer: 'Bank of Uganda',
    interestRate: 16.5,
    minimumInvestment: 50000,
    maturityDate: '2034-12-15',
    duration: 120, // 10 years
    yield: 16.5,
    issuanceDate: '2024-01-15',
    status: 'active',
    description: 'Long-term government bond with semi-annual coupon payments',
    riskRating: 'low'
  },
  {
    id: '2',
    type: 'treasury_bill',
    name: '91-Day Treasury Bill',
    issuer: 'Bank of Uganda',
    interestRate: 10.2,
    minimumInvestment: 1000000,
    maturityDate: '2024-06-30',
    duration: 3,
    yield: 10.45,
    issuanceDate: '2024-04-01',
    status: 'active',
    description: 'Short-term treasury bill with discount pricing',
    riskRating: 'low'
  },
  {
    id: '3',
    type: 'treasury_bill',
    name: '182-Day Treasury Bill',
    issuer: 'Bank of Uganda',
    interestRate: 12.8,
    minimumInvestment: 1000000,
    maturityDate: '2024-09-15',
    duration: 6,
    yield: 13.1,
    issuanceDate: '2024-03-15',
    status: 'active',
    description: 'Medium-term treasury bill with competitive yields',
    riskRating: 'low'
  },
  {
    id: '4',
    type: 'government_bond',
    name: 'Uganda Government Bond - 5 Year',
    issuer: 'Bank of Uganda',
    interestRate: 15.2,
    minimumInvestment: 50000,
    maturityDate: '2029-08-20',
    duration: 60,
    yield: 15.2,
    issuanceDate: '2024-02-20',
    status: 'active',
    description: 'Medium-term government bond with quarterly coupon payments',
    riskRating: 'low'
  },
  {
    id: '5',
    type: 'treasury_bill',
    name: '364-Day Treasury Bill',
    issuer: 'Bank of Uganda',
    interestRate: 14.5,
    minimumInvestment: 1000000,
    maturityDate: '2025-03-10',
    duration: 12,
    yield: 15.2,
    issuanceDate: '2024-03-10',
    status: 'active',
    description: 'One-year treasury bill with attractive returns',
    riskRating: 'low'
  },
  {
    id: '6',
    type: 'government_bond',
    name: 'Uganda Government Bond - 15 Year',
    issuer: 'Bank of Uganda',
    interestRate: 17.8,
    minimumInvestment: 100000,
    maturityDate: '2039-11-30',
    duration: 180,
    yield: 17.8,
    issuanceDate: '2024-01-30',
    status: 'active',
    description: 'Long-term bond for institutional and high-net-worth investors',
    riskRating: 'low'
  }
];

export const issuers = ['Bank of Uganda', 'Ministry of Finance'];
export const securityTypes = [
  { value: '', label: 'All Types' },
  { value: 'government_bond', label: 'Government Bonds' },
  { value: 'treasury_bill', label: 'Treasury Bills' }
];