import { YieldCalculation } from '../types';

export const calculateYield = (
  principal: number,
  interestRate: number,
  tenor: number,
  securityType: 'government_bond' | 'treasury_bill'
): YieldCalculation => {
  // For government bonds, we need to distinguish between coupon rate and YTM
  // interestRate represents the coupon rate, but we'll use a market-based YTM
  const couponRate = interestRate / 100;
  
  if (securityType === 'treasury_bill') {
    // Treasury bills: discount instruments
    const faceValue = principal;
    const discountRate = couponRate * (tenor / 12);
    const purchasePrice = faceValue / (1 + discountRate);
    const totalReturns = faceValue;
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
    // Total at maturity = Current market value compounded at YTM
    
    return {
    // Annual coupon payments (face value assumed equal to principal for simplicity)
      tenor,
    const annualCouponPayment = faceValue * couponRate;
      totalReturns,
      netReturns,
    // For bonds, total returns should include both coupon payments and final principal
    // But since we're calculating based on YTM, the totalReturns already incorporates expected returns
    const netReturns = totalReturns - principal;
    // Government bonds: Use market-based YTM for accurate calculations
    // The effective yield is the YTM we used
    const effectiveYield = marketYTM * 100;
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