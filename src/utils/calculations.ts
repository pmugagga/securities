import { YieldCalculation } from '../types';

export const calculateYield = (
  principal: number,
  interestRate: number,
  tenor: number,
  securityType: 'government_bond' | 'treasury_bill'
): YieldCalculation => {
  const rate = interestRate / 100;
  
  if (securityType === 'treasury_bill') {
    // Treasury bills are discount instruments
    const discount = (principal * rate * tenor) / 12;
    const purchasePrice = principal - discount;
    const totalReturns = principal;
    const netReturns = totalReturns - purchasePrice;
    const effectiveYield = (netReturns / purchasePrice) * (12 / tenor) * 100;
    
    return {
      principal: purchasePrice,
      tenor,
      interestRate,
      totalReturns,
      netReturns,
      effectiveYield
    };
  } else {
    // Government bonds pay periodic interest
    const periodsPerYear = 2; // Semi-annual payments
    const totalPeriods = (tenor / 12) * periodsPerYear;
    const periodRate = rate / periodsPerYear;
    
    // Simple interest calculation for demonstration
    const totalInterest = principal * rate * (tenor / 12);
    const totalReturns = principal + totalInterest;
    const netReturns = totalInterest;
    const effectiveYield = (totalInterest / principal) * (12 / tenor) * 100;
    
    return {
      principal,
      tenor,
      interestRate,
      totalReturns,
      netReturns,
      effectiveYield
    };
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    notation: amount >= 1000000 ? 'compact' : 'standard',
    compactDisplay: 'short'
  }).format(amount);
};

export const formatPercentage = (rate: number): string => {
  return `${rate.toFixed(2)}%`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};