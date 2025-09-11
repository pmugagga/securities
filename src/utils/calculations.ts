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
  maturityDate: string,
  securityType: string,
  yieldToMaturity?: number
): YieldCalculation {
  const yearsToMaturity = calculateYearsToMaturity(maturityDate);
  
  if (securityType === 'treasury_bill') {
    // Treasury bills are discount instruments
    const discountRate = interestRate / 100;
    const discountAmount = principal * discountRate * (yearsToMaturity);
    const purchasePrice = principal - discountAmount;
    const totalReturns = discountAmount;
    const effectiveYield = (discountAmount / purchasePrice) * (365 / calculateDaysToMaturity(maturityDate)) * 100;
    
    return {
      totalAtMaturity: principal, // Face value received at maturity
      totalReturns,
      effectiveYield,
      purchasePrice,
    };
  } else {
    // Government bonds - use YTM if provided, otherwise estimate
    const ytm = yieldToMaturity || Math.max(interestRate * 2.5, 17); // Minimum 17% or 2.5x coupon rate
    const couponRate = interestRate / 100;
    const ytmDecimal = ytm / 100;
    
    // Calculate total at maturity using YTM compounding
    const totalAtMaturity = principal * Math.pow(1 + ytmDecimal, yearsToMaturity);
    const totalReturns = totalAtMaturity - principal;
    
    // Calculate coupon payments (semi-annual)
    const faceValue = principal; // Assuming investment amount equals face value for simplicity
    const semiAnnualCoupon = (faceValue * couponRate) / 2;
    const totalCouponPayments = Math.floor(yearsToMaturity * 2);
    const totalCoupons = semiAnnualCoupon * totalCouponPayments;
    
    return {
      totalAtMaturity,
      totalReturns,
      effectiveYield: ytm,
      couponPayments: totalCoupons,
      capitalGain: totalAtMaturity - principal - totalCoupons,
      paymentSchedule: {
        frequency: 'Semi-annual',
        paymentAmount: semiAnnualCoupon,
        totalPayments: totalCouponPayments,
      },
    };
  }
}

export function calculateProjectedReturns(
  investmentAmount: number,
  selectedTenor: number,
  interestRate: number,
  securityType: string,
  maturityDate: string,
  yieldToMaturity?: number
): number {
  const calculation = calculateYield(
    investmentAmount,
    interestRate,
    maturityDate,
    securityType,
    yieldToMaturity
  );
  
  return calculation.totalReturns;
}