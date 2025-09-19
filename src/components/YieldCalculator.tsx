import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';
import { Security } from '../types';
import { calculateYield, formatCurrency, formatPercentage } from '../utils/calculations';

interface YieldCalculatorProps {
  security: Security;
  onExpressInterest: (amount: number, tenor: number, projectedReturns: number) => void;
}

export const YieldCalculator: React.FC<YieldCalculatorProps> = ({ security, onExpressInterest }) => {
  const [amount, setAmount] = useState(security.minimumInvestment);
  const [tenor, setTenor] = useState(security.duration);
  const [calculation, setCalculation] = useState(calculateYield(amount, security.interestRate, tenor, security.type));

  const availableTenors = security.type === 'treasury_bill' 
    ? [3, 6, 12] 
    : [12, 24, 36, 60, 120, 180];

  useEffect(() => {
    const result = calculateYield(amount, security.interestRate, tenor, security.type, security.yield, security.maturityDate);
    setCalculation(result);
  }, [amount, tenor, security]);

  const handleExpressInterest = () => {
    onExpressInterest(amount, tenor, calculation.totalReturns);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center mb-4">
        <Calculator className="w-5 h-5 text-blue-600 mr-2" />
        <h4 className="text-lg font-semibold text-gray-900">Yield Calculator</h4>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Amount (UGX)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(security.minimumInvestment, parseInt(e.target.value) || 0))}
              min={security.minimumInvestment}
              step="1000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum: {formatCurrency(security.minimumInvestment)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Period (months)
            </label>
            <select
              value={tenor}
              onChange={(e) => setTenor(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {availableTenors.map(months => (
                <option key={months} value={months}>
                  {months} months {months >= 12 ? `(${Math.floor(months / 12)} year${months >= 24 ? 's' : ''})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {security.type === 'government_bond' && calculation.bondDetails && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h5 className="font-semibold text-blue-900 mb-2">Bond Analysis</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Face Value:</span>
                <div className="font-semibold">{formatCurrency(calculation.faceValue || 0)}</div>
              </div>
              <div>
                <span className="text-blue-700">Annual Coupon:</span>
                <div className="font-semibold">{formatCurrency(calculation.annualCoupon || 0)}</div>
              </div>
              <div>
                <span className="text-blue-700">Coupon Rate:</span>
                <div className="font-semibold">{formatPercentage(security.interestRate)}</div>
              </div>
              <div>
                <span className="text-blue-700">YTM:</span>
                <div className="font-semibold">{formatPercentage(security.yield)}</div>
              </div>
            </div>
          </div>
        )}
        <>
          <div className="bg-white rounded-lg p-4 border">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
            {security.type === 'government_bond' ? 'Projected Returns (2-Year Hold)' : 'Projected Returns'}
          </h5>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-700 font-medium mb-1">
                  Current Market Value
                </div>
                <div className="font-bold text-lg text-gray-900 break-words">
                  {formatCurrency(calculation.principal)}
                </div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-700 font-medium mb-1">
                Total Proceeds
                </div>
                <div className="font-bold text-lg text-green-600 break-words">
                  {formatCurrency(calculation.totalReturns)}
                </div>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="text-sm text-emerald-700 font-medium mb-1">
                  Total Gain
                </div>
                <div className="font-bold text-lg text-green-600 break-words">
                  {formatCurrency(calculation.netReturns)}
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-700 font-medium mb-1">
                Annualized Return
                Investment Amount
                <div className="font-bold text-lg text-blue-600">
                  {formatPercentage(calculation.effectiveYield)}
                </div>
              </div>
            </div>
          
          {security.type === 'government_bond' && calculation.bondDetails && (
            <div className="mt-4 pt-4 border-t">
              <h6 className="font-medium text-gray-800 mb-2">Breakdown (2-Year Holding Period)</h6>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-yellow-50 p-3 rounded">
                  <div className="text-yellow-700 font-medium">Coupon Payments</div>
                  <div className="text-lg font-bold text-yellow-800">
                    {formatCurrency(calculation.totalCoupons || 0)}
                  </div>
                  <div className="text-xs text-yellow-600">
                    {formatCurrency(calculation.annualCoupon || 0)} × 2 years
                  </div>
                </div>
                <div className="bg-indigo-50 p-3 rounded">
                  <div className="text-indigo-700 font-medium">Capital Gain</div>
                  <div className="text-lg font-bold text-indigo-800">
                    {formatCurrency(calculation.capitalGain || 0)}
                  </div>
                  <div className="text-xs text-indigo-600">
                    Sale price - Purchase price
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-green-700 font-medium">Total Return</div>
                  <div className="text-lg font-bold text-green-800">
                    {formatPercentage(calculation.bondDetails.holdingPeriodReturn)}
                  </div>
                  <div className="text-xs text-green-600">
                    Over 2 years
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleExpressInterest}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Express Interest for This Calculation
            </button>
          </div>
        </>
      </div>
    </div>
  );
};