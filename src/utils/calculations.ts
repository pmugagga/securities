export interface YieldCalculation {
  principal: number;
  totalReturns: number;
  netReturns: number;
  effectiveYield: number;
  faceValue?: number;
  annualCoupon?: number;
  netAnnualCoupon?: number;
  totalCouponIncome?: number;
  exitPrice?: number;
  projectedReturn?: number;
  annualizedReturn?: number;
  holdingPeriodReturn?: number;
  timeToMaturityYears?: number;
  remainingMaturityYears?: number;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-UG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function calculateDaysToMaturity(maturityDate: Date): number {
  const today = new Date();
  const diffTime = maturityDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateYearsToMaturity(maturityDate: Date): number {
  return calculateDaysToMaturity(maturityDate) / 365.25;
}

// Helper function to calculate time difference in years
function calculateYearsDifference(startDate: Date, endDate: Date): number {
  const diffTime = endDate.getTime() - startDate.getTime();
  return diffTime / (1000 * 60 * 60 * 24 * 365.25);
}

// Helper function to calculate after-tax coupons received during holding period
function calculateCouponsReceived(
  investmentAmount: number,
  couponRate: number,
  holdingPeriodYears: number,
  withholdingTaxRate: number = 0.10
): number {
  const grossAnnualCoupon = investmentAmount * (couponRate / 100);
  const netAnnualCoupon = grossAnnualCoupon * (1 - withholdingTaxRate);
  return netAnnualCoupon * holdingPeriodYears;
}

// Helper function to calculate exit price using present value of remaining cash flows
function calculateExitPrice(
  investmentAmount: number,
  couponRate: number,
  ytm: number,
  remainingYearsToMaturity: number
): number {
  if (remainingYearsToMaturity <= 0) {
    return investmentAmount; // At maturity, bond is worth face value
  }

  const grossAnnualCoupon = investmentAmount * (couponRate / 100);
  const ytmDecimal = ytm / 100;
  
  // Present value of remaining coupon payments (gross, since buyer will receive them)
  let pvCoupons = 0;
  const remainingCouponPayments = Math.floor(remainingYearsToMaturity);
  
  for (let i = 1; i <= remainingCouponPayments; i++) {
    pvCoupons += grossAnnualCoupon / Math.pow(1 + ytmDecimal, i);
  }
  
  // Present value of redemption amount
  const pvRedemption = investmentAmount / Math.pow(1 + ytmDecimal, remainingYearsToMaturity);
  
  return pvCoupons + pvRedemption;
}

// Helper function to calculate annualized return
function calculateAnnualizedReturn(hpr: number, holdingPeriodYears: number): number {
  if (holdingPeriodYears <= 0) return 0;
  return (Math.pow(1 + hpr, 1 / holdingPeriodYears) - 1) * 100;
}

export function calculateYield(
  amount: number,
  interestRate: number,
  tenorMonths: number,
  securityType: string,
  ytm?: number,
  maturityDate?: Date
): YieldCalculation {
  const principal = amount;
  const tenorYears = tenorMonths / 12;
  
  if (securityType === 'treasury_bill') {
    // Treasury Bill calculation (discount instrument)
    const discountRate = interestRate / 100;
    const faceValue = amount / (1 - (discountRate * tenorYears));
    const totalReturns = faceValue;
    const netReturns = totalReturns - principal;
    const effectiveYield = (netReturns / principal) * (12 / tenorMonths) * 100;
    
    return {
      principal,
      totalReturns,
      netReturns,
      effectiveYield,
      faceValue
    };
  } else {
    // Government Bond calculation using the specified formula
    const currentDate = new Date(); // Booking Date = Current Business Date
    const bondMaturityDate = maturityDate || new Date(Date.now() + (20 * 365.25 * 24 * 60 * 60 * 1000)); // Default 20 years if not provided
    
    // Step 1: Compute time to maturity from current business date
    const timeToMaturityYears = calculateYearsDifference(currentDate, bondMaturityDate);
    
    // Step 2: Compute holding period in years
    const holdingPeriodYears = tenorMonths / 12;
    
    // Step 3: Calculate after-tax coupons received during holding period
    const couponRate = interestRate;
    const totalCouponsReceived = calculateCouponsReceived(amount, couponRate, holdingPeriodYears);
    
    // Step 4: Calculate remaining maturity at exit
    const remainingMaturityYears = Math.max(0, timeToMaturityYears - holdingPeriodYears);
    
    // Step 5: Calculate exit price
    const yieldToMaturity = ytm || 17.2; // Default YTM if not provided
    const exitPrice = calculateExitPrice(amount, couponRate, yieldToMaturity, remainingMaturityYears);
    
    // Step 6: Calculate total proceeds and returns
    const totalProceeds = totalCouponsReceived + exitPrice;
    const netGain = totalProceeds - amount;
    
    // Step 7: Calculate Holding Period Return (HPR)
    const hpr = netGain / amount;
    
    // Step 8: Calculate Annualized Return
    const annualizedReturn = calculateAnnualizedReturn(hpr, holdingPeriodYears);
    
    // Calculate gross annual coupon for display
    const grossAnnualCoupon = amount * (couponRate / 100);
    const netAnnualCoupon = grossAnnualCoupon * 0.90; // After 10% tax
    
    return {
      principal: amount,
      totalReturns: totalProceeds,
      netReturns: netGain,
      effectiveYield: annualizedReturn,
      faceValue: amount, // Investment amount serves as face value in this model
      annualCoupon: grossAnnualCoupon,
      netAnnualCoupon: netAnnualCoupon,
      totalCouponIncome: totalCouponsReceived,
      exitPrice: exitPrice,
      projectedReturn: hpr * 100, // HPR as percentage
      annualizedReturn: annualizedReturn,
      holdingPeriodReturn: hpr * 100,
      timeToMaturityYears: timeToMaturityYears,
      remainingMaturityYears: remainingMaturityYears
    };
  }
}