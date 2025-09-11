// Utility functions for financial calculations and formatting

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function calculateDaysToMaturity(maturityDate: string): number {
  const today = new Date();
  const maturity = new Date(maturityDate);
  const diffTime = maturity.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateYearsToMaturity(maturityDate: string): number {
  const days = calculateDaysToMaturity(maturityDate);
  return days / 365;
}

export interface YieldCalculation {
  totalAtMaturity: number;
  totalReturns: number;
  effectiveYield: number;
  purchasePrice?: number;
  couponPayments?: number;
  capitalGain?: number;
  paymentSchedule?: {
    frequency: string;
    paymentAmount: number;
    totalPayments: number;
  };
}

export function calculateYield(
  principal: number,
  interestRate: number,
  tenor: number,
  securityType: 'government_bond' | 'treasury_bill',
  yieldToMaturity?: number
) {
  const yearsToMaturity = tenor / 12;
  
  if (securityType === 'treasury_bill') {
    // Treasury bills are discount instruments
    const discountRate = interestRate / 100;
    const discountAmount = principal * discountRate * yearsToMaturity;
    const purchasePrice = principal - discountAmount;
    const netReturns = discountAmount;
    const effectiveYield = (discountAmount / purchasePrice) * (12 / tenor) * 100;
    
    return {
      principal: purchasePrice,
      totalReturns: principal, // Face value received at maturity
      netReturns,
      effectiveYield,
    };
  } else {
    // Government bonds - use YTM if provided, otherwise estimate
    const ytm = yieldToMaturity || Math.max(interestRate * 1.5, 17); // Minimum 17% or 1.5x coupon rate
    const ytmDecimal = ytm / 100;
    
    // Calculate total at maturity using YTM compounding
    const totalAtMaturity = principal * Math.pow(1 + ytmDecimal, yearsToMaturity);
    const netReturns = totalAtMaturity - principal;
    
    return {
      principal,
      totalReturns: totalAtMaturity,
      netReturns,
      effectiveYield: ytm,
    };
  }
}