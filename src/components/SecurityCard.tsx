import React, { useState } from 'react';
import { Calendar, DollarSign, TrendingUp, Clock, Building2 } from 'lucide-react';
import { Security } from '../types';
import { formatCurrency, formatPercentage, formatDate } from '../utils/calculations';
import { YieldCalculator } from './YieldCalculator';
import { InterestModal } from './InterestModal';

interface SecurityCardProps {
  security: Security;
  onExpressInterest: (securityId: string, amount: number, tenor: number, projectedReturns: number) => void;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({ security, onExpressInterest }) => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [calculatedTenor, setCalculatedTenor] = useState(0);
  const [calculatedReturns, setCalculatedReturns] = useState(0);

  const getTypeColor = (type: string) => {
    return type === 'government_bond' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExpressInterest = (amount: number, tenor: number, projectedReturns: number) => {
    setCalculatedAmount(amount);
    setCalculatedTenor(tenor);
    setCalculatedReturns(projectedReturns);
    setShowInterestModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{security.name}</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(security.type)}`}>
                  {security.type === 'government_bond' ? 'Government Bond' : 'Treasury Bill'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(security.status)}`}>
                  {security.status.charAt(0).toUpperCase() + security.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{security.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {formatPercentage(security.yield)}
              </div>
              <div className="text-sm text-gray-500">Yield</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Issuer</div>
                <div className="font-medium text-gray-900">{security.issuer}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Duration</div>
                <div className="font-medium text-gray-900">{security.duration} months</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Interest Rate</div>
                <div className="font-medium text-gray-900">{formatPercentage(security.interestRate)}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Maturity</div>
                <div className="font-medium text-gray-900">{formatDate(new Date(security.maturityDate))}</div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Minimum Investment: <span className="font-semibold">{formatCurrency(security.minimumInvestment)}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                {showCalculator ? 'Hide Calculator' : 'Calculate Returns'}
              </button>
              <button
                onClick={() => setShowInterestModal(true)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Express Interest
              </button>
            </div>
          </div>

          {showCalculator && (
            <div className="mt-6 pt-4 border-t">
              <YieldCalculator
                security={security}
                onExpressInterest={handleExpressInterest}
              />
            </div>
          )}
        </div>
      </div>

      <InterestModal
        isOpen={showInterestModal}
        onClose={() => setShowInterestModal(false)}
        security={security}
        investmentAmount={calculatedAmount}
        selectedTenor={calculatedTenor}
        projectedReturns={calculatedReturns}
        onSubmit={(amount, tenor, returns) => {
          onExpressInterest(security.id, amount, tenor, returns);
          setShowInterestModal(false);
        }}
      />
    </>
  );
};