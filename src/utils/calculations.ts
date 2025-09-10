import { YieldCalculation } from '../types';

export const calculateYield = (
  principal: number,
  interestRate: number,
  tenor: number,
  securityType: 'government_bond' | 'treasury_bill'
): YieldCalculation => {
  const rate = interestRate / 100;
  
  if (securityType === 'treasury_bill') {
    // Treasury bills are discount instruments - you buy at discount and receive face value at maturity
    // Face value is what you want to receive, purchase price is discounted
    const faceValue = principal;
    const discountRate = rate * (tenor / 12); // Annualized rate adjusted for tenor
    const purchasePrice = faceValue / (1 + discountRate);
    const totalReturns = faceValue;
    const netReturns = totalReturns - purchasePrice;
    
    // Effective yield calculation for discount instruments
    const effectiveYield = ((faceValue - purchasePrice) / purchasePrice) * (365 / (tenor * 30.44)) * 100;
    
    return {
      principal: purchasePrice,
      tenor,
      interestRate,
      totalReturns,
      netReturns,
      effectiveYield
    };
  } else {
    // Government bonds pay periodic coupon payments plus principal at maturity
    const periodsPerYear = 2; // Semi-annual coupon payments
    const totalPeriods = (tenor / 12) * periodsPerYear;
    const couponRate = rate / periodsPerYear; // Semi-annual coupon rate
    const couponPayment = principal * couponRate;
    
    // Calculate present value of all coupon payments
    let presentValueCoupons = 0;
    for (let period = 1; period <= totalPeriods; period++) {
      presentValueCoupons += couponPayment / Math.pow(1 + couponRate, period);
    }
    
    // Present value of principal repayment
    const presentValuePrincipal = principal / Math.pow(1 + couponRate, totalPeriods);
    
    // Total coupon payments over the life of the bond
    const totalCouponPayments = couponPayment * totalPeriods;
    const totalReturns = principal + totalCouponPayments;
    const netReturns = totalCouponPayments;
    
    // Yield to Maturity calculation (approximation using current yield)
    const currentYield = (totalCouponPayments / (tenor / 12)) / principal * 100;
    
    // More accurate YTM approximation considering time value
    const yearsToMaturity = tenor / 12;
    const effectiveYield = ((totalReturns / principal) ** (1 / yearsToMaturity) - 1) * 100;
    
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
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    notation: amount >= 1000000 ? 'compact' : 'standard',
    compactDisplay: 'short'
  }).format(amount) + ' UGX';
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