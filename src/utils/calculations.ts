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
  return new Intl.DateFormat('en-UG', {
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

// Function to calculate face value from investment amount using YTM
function calculateFaceValue(investmentAmount: number, couponRate: number, ytm: number, yearsToMaturity: number): number {
  // Use iterative method to find face value
  let faceValue = investmentAmount;
  let iterations = 0;
  const maxIterations = 100;
  const tolerance = 1;

  while (iterations < maxIterations) {
    const couponPayment = faceValue * (couponRate / 100);
    
    // Calculate present value of coupon payments
    let pvCoupons = 0;
    for (let i = 1; i <= yearsToMaturity; i++) {
      pvCoupons += couponPayment / Math.pow(1 + ytm / 100, i);
    }
    
    // Calculate present value of face value
    const pvFaceValue = faceValue / Math.pow(1 + ytm / 100, yearsToMaturity);
    
    // Total present value (theoretical bond price)
    const theoreticalPrice = pvCoupons + pvFaceValue;
    
    // Check if we're close enough
    if (Math.abs(theoreticalPrice - investmentAmount) < tolerance) {
      break;
    }
    
    // Adjust face value
    faceValue = faceValue * (investmentAmount / theoreticalPrice);
    iterations++;
  }
  
  return faceValue;
}

// Function to calculate bond price given face value, coupon rate, YTM, and years to maturity
function calculateBondPrice(faceValue: number, couponRate: number, ytm: number, yearsToMaturity: number): number {
  const couponPayment = faceValue * (couponRate / 100);
  
  // Calculate present value of coupon payments
  let pvCoupons = 0;
  for (let i = 1; i <= yearsToMaturity; i++) {
    pvCoupons += couponPayment / Math.pow(1 + ytm / 100, i);
  }
  
  // Calculate present value of face value
  const pvFaceValue = faceValue / Math.pow(1 + ytm / 100, yearsToMaturity);
  
  return pvCoupons + pvFaceValue;
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
    // Government Bond calculation using the provided formula
    const couponRate = interestRate;
    const yieldToMaturity = ytm || 17.2; // Default YTM if not provided
    
    // Calculate years to maturity (assume 20 years if maturity date not provided)
    let yearsToMaturity = 20;
    if (maturityDate) {
      yearsToMaturity = calculateYearsToMaturity(maturityDate);
    }
    
    // Step 1: Calculate Face Value from investment amount
    const faceValue = calculateFaceValue(amount, couponRate, yieldToMaturity, yearsToMaturity);
    
    // Step 2: Compute Annual Coupon Payment
    const annualCoupon = faceValue * (couponRate / 100);
    
    // Step 3: Compute Net Annual Coupon (after 10% tax)
    const netAnnualCoupon = annualCoupon * 0.90;
    
    // Step 4: Convert investment period to years
    const holdingPeriodYears = tenorMonths / 12;
    
    // Step 5: Compute Total Coupon Income over holding period
    const totalCouponIncome = netAnnualCoupon * holdingPeriodYears;
    
    // Step 6: Compute Bond Price at Purchase (P₀) - this should equal our investment amount
    const initialPrice = amount;
    
    // Step 7: Compute Bond Price at Exit (Pₜ) after holding for t years
    const remainingYears = yearsToMaturity - holdingPeriodYears;
    const exitPrice = calculateBondPrice(faceValue, couponRate, yieldToMaturity, remainingYears);
    
    // Step 8: Compute Exit Value
    const exitValue = exitPrice + totalCouponIncome;
    
    // Step 9: Compute Projected Return (%)
    const projectedReturn = ((exitValue - initialPrice) / initialPrice) * 100;
    
    // Step 10: Compute Annualized Return
    const annualizedReturn = (Math.pow(exitValue / initialPrice, 1 / holdingPeriodYears) - 1) * 100;
    
    return {
      principal: initialPrice,
      totalReturns: exitValue,
      netReturns: exitValue - initialPrice,
      effectiveYield: annualizedReturn,
      faceValue,
      annualCoupon,
      netAnnualCoupon,
      totalCouponIncome,
      exitPrice,
      projectedReturn,
      annualizedReturn
    };
  }
}