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
    const result = calculateYield(amount, security.interestRate, tenor, security.type);
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

        <div className="bg-white rounded-lg p-4 border">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
            Projected Returns
          </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="text-sm text-gray-500 mb-1">Principal Amount</div>
                <div className="font-bold text-lg text-gray-900 break-words">
                  {formatCurrency(calculation.principal)}
                </div>
              <div className="font-semibold text-gray-900">{formatCurrency(calculation.principal)}</div>
            </div>
                <div className="text-sm text-gray-500 mb-1">Total at Maturity</div>
                <div className="font-bold text-lg text-green-600 break-words">
                  {formatCurrency(calculation.totalReturns)}
                </div>
              <div className="font-semibold text-green-600">{formatCurrency(calculation.totalReturns)}</div>
            </div>
                <div className="text-sm text-gray-500 mb-1">Net Profit</div>
                <div className="font-bold text-lg text-green-600 break-words">
                  {formatCurrency(calculation.netReturns)}
                </div>
              <div className="font-semibold text-green-600">{formatCurrency(calculation.netReturns)}</div>
            </div>
                <div className="text-sm text-gray-500 mb-1">Effective Yield (p.a.)</div>
                <div className="font-bold text-lg text-blue-600">
                  {formatPercentage(calculation.effectiveYield)}
                </div>
              <div className="font-semibold text-blue-600">{formatPercentage(calculation.effectiveYield)}</div>
            </div>
            
            {/* Additional breakdown for large amounts */}
            {amount >= 1000000 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-blue-700 font-medium mb-1">Monthly Equivalent</div>
                    <div className="text-blue-900 font-semibold">
                      {formatCurrency(calculation.netReturns / tenor)} per month
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-green-700 font-medium mb-1">Return on Investment</div>
                    <div className="text-green-900 font-semibold">
                      {formatPercentage((calculation.netReturns / calculation.principal) * 100)}
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-purple-700 font-medium mb-1">Investment Period</div>
                    <div className="text-purple-900 font-semibold">
                      {tenor} months ({Math.floor(tenor / 12)} year{tenor >= 24 ? 's' : ''} {tenor % 12 > 0 ? `${tenor % 12}m` : ''})
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleExpressInterest}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Express Interest for This Calculation
          </button>
        </div>
      </div>
    </div>
  );
};