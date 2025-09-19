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

// Calculate face value from current market price and YTM
function calculateFaceValue(marketPrice: number, couponRate: number, ytm: number, yearsToMaturity: number): number {
  // Using iterative approach to solve for face value
  // Price = (Coupon/YTM) * (1 - (1+YTM)^-n) + FaceValue/(1+YTM)^n
  
  let faceValue = marketPrice; // Initial guess
  const tolerance = 0.01;
  let iterations = 0;
  const maxIterations = 100;
  
  while (iterations < maxIterations) {
    const annualCoupon = faceValue * couponRate;
    const couponPV = (annualCoupon / ytm) * (1 - Math.pow(1 + ytm, -yearsToMaturity));
    const principalPV = faceValue / Math.pow(1 + ytm, yearsToMaturity);
    const calculatedPrice = couponPV + principalPV;
    
    const difference = calculatedPrice - marketPrice;
    
    if (Math.abs(difference) < tolerance) {
      break;
    }
    
    // Adjust face value based on difference
    faceValue = faceValue * (marketPrice / calculatedPrice);
    iterations++;
  }
  
  return faceValue;
}

// Calculate bond price given face value, coupon rate, YTM, and years to maturity
function calculateBondPrice(faceValue: number, couponRate: number, ytm: number, yearsToMaturity: number): number {
  const annualCoupon = faceValue * couponRate;
  const couponPV = (annualCoupon / ytm) * (1 - Math.pow(1 + ytm, -yearsToMaturity));
  const principalPV = faceValue / Math.pow(1 + ytm, yearsToMaturity);
  return couponPV + principalPV;
}
export interface YieldCalculation {
  totalAtMaturity: number;
  totalReturns: number;
  effectiveYield: number;
  faceValue?: number;
  annualCoupon?: number;
  totalCoupons?: number;
  capitalGain?: number;
  bondDetails?: {
    currentPrice: number;
    futurePrice: number;
    totalCouponPayments: number;
    holdingPeriodReturn: number;
    annualizedReturn: number;
  };
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
  yieldToMaturity?: number,
  maturityDate?: string
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
    
    // Calculate face value from market price
    const faceValue = calculateFaceValue(principal, couponRate, ytm, yearsToMaturity);
    const annualCoupon = faceValue * couponRate;
    
    // For holding period calculation (assume 2-year holding period for demonstration)
    const holdingPeriod = Math.min(2, yearsToMaturity);
    const remainingYears = yearsToMaturity - holdingPeriod;
    
    // Calculate total coupon payments during holding period
    const totalCouponPayments = annualCoupon * holdingPeriod;
    
    // Calculate bond price at end of holding period (if not held to maturity)
    let futurePrice = faceValue; // If held to maturity
    if (remainingYears > 0) {
      futurePrice = calculateBondPrice(faceValue, couponRate, ytm, remainingYears);
    }
    
    // Total proceeds from investment
    const totalProceeds = totalCouponPayments + futurePrice;
    const capitalGain = futurePrice - principal;
    const netReturns = totalProceeds - principal;
    
    // Calculate holding period return and annualized return
    const holdingPeriodReturn = (netReturns / principal) * 100;
    const annualizedReturn = holdingPeriod > 0 ? 
      (Math.pow(totalProceeds / principal, 1 / holdingPeriod) - 1) * 100 : 0;
    
    return {
      principal,
      totalReturns: totalProceeds,
      netReturns,
      effectiveYield: annualizedReturn,
      faceValue,
      annualCoupon,
      totalCoupons: totalCouponPayments,
      capitalGain,
      bondDetails: {
        currentPrice: principal,
        futurePrice,
        totalCouponPayments,
        holdingPeriodReturn,
        annualizedReturn
      }
    };
  }
}