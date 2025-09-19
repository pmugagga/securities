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
    // Government bonds - use the specified formula
    return calculateBondReturns(principal, interestRate, tenor, yieldToMaturity);
  }
}

function calculateBondReturns(
  investmentAmount: number,
  couponRate: number,
  tenorMonths: number,
  yieldToMaturity: number = 17.2
) {
  // Inputs
  const P = investmentAmount; // Investment Amount
  const C = couponRate; // Coupon Rate in %
  const YTM = yieldToMaturity; // Yield to Maturity in %
  const M = tenorMonths; // Investment Period in months
  const Y = 20; // Bond Maturity in years (assumed for government bonds)
  const withholdingTax = 0.10; // 10% withholding tax
  
  // Step 1: Calculate Face Value from Investment Amount
  // We need to solve for FV where P = bond price at YTM
  // Using iterative method to find face value
  let FV = P * 1.3; // Initial guess (bonds typically trade at discount)
  const tolerance = 1;
  let iterations = 0;
  const maxIterations = 100;
  
  while (iterations < maxIterations) {
    // Calculate theoretical bond price with current FV guess
    const couponPayment = (FV * C) / 100;
    const ytmDecimal = YTM / 100;
    
    // Present value of coupon payments
    let couponPV = 0;
    for (let i = 1; i <= Y; i++) {
      couponPV += couponPayment / Math.pow(1 + ytmDecimal, i);
    }
    
    // Present value of principal repayment
    const principalPV = FV / Math.pow(1 + ytmDecimal, Y);
    
    const theoreticalPrice = couponPV + principalPV;
    const difference = Math.abs(theoreticalPrice - P);
    
    if (difference < tolerance) {
      break;
    }
    
    // Adjust face value
    FV = FV * (P / theoreticalPrice);
    iterations++;
  }
  
  // Step 2: Compute Annual Coupon Payment
  const couponPayment = (FV * C) / 100;
  
  // Step 3: Compute Net Annual Coupon (after 10% tax)
  const netCoupon = couponPayment * (1 - withholdingTax);
  
  // Step 4: Convert investment period to years
  const t = M / 12;
  
  // Step 5: Compute Total Coupon Income over holding period
  const totalCouponIncome = netCoupon * t;
  
  // Step 6: Compute Bond Price at Purchase (P₀) - this is our investment amount
  const P0 = P;
  
  // Step 7: Compute Bond Price at Exit (Pₜ) after holding for t years
  const remainingYears = Y - t;
  const ytmDecimal = YTM / 100;
  
  let Pt = 0;
  if (remainingYears > 0) {
    // Present value of remaining coupon payments
    let remainingCouponPV = 0;
    for (let i = 1; i <= remainingYears; i++) {
      remainingCouponPV += couponPayment / Math.pow(1 + ytmDecimal, i);
    }
    
    // Present value of principal repayment
    const remainingPrincipalPV = FV / Math.pow(1 + ytmDecimal, remainingYears);
    
    Pt = remainingCouponPV + remainingPrincipalPV;
  } else {
    // If holding to maturity
    Pt = FV;
  }
  
  // Step 8: Compute Exit Value
  const exitValue = Pt + totalCouponIncome;
  
  // Step 9: Compute Projected Return (%)
  const projectedReturn = ((exitValue - P0) / P0) * 100;
  
  // Calculate annualized return
  const annualizedReturn = t > 0 ? (Math.pow(exitValue / P0, 1 / t) - 1) * 100 : 0;
  
  return {
    principal: P0,
    totalReturns: exitValue,
    netReturns: exitValue - P0,
    effectiveYield: annualizedReturn,
    faceValue: FV,
    annualCoupon: couponPayment,
    netAnnualCoupon: netCoupon,
    totalCouponIncome,
    exitPrice: Pt,
    projectedReturn,
    bondDetails: {
      initialPrice: P0,
      exitPrice: Pt,
      totalCouponIncome,
      exitValue,
      projectedReturn,
      annualizedReturn,
      withholdingTax: withholdingTax * 100
    }
  };
}