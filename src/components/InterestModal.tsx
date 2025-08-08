import React, { useState } from 'react';
import { X, User, Mail, Phone, DollarSign } from 'lucide-react';
import { Security } from '../types';
import { formatCurrency, formatPercentage } from '../utils/calculations';

interface InterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  security: Security;
  investmentAmount?: number;
  selectedTenor?: number;
  projectedReturns?: number;
  onSubmit: (amount: number, tenor: number, returns: number) => void;
}

export const InterestModal: React.FC<InterestModalProps> = ({
  isOpen,
  onClose,
  security,
  investmentAmount = security.minimumInvestment,
  selectedTenor = security.duration,
  projectedReturns = 0,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    investmentAmount: investmentAmount,
    selectedTenor: selectedTenor
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData.investmentAmount, formData.selectedTenor, projectedReturns);
    onClose();
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      investmentAmount: security.minimumInvestment,
      selectedTenor: security.duration
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Express Interest</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">{security.name}</h3>
            <div className="text-sm text-blue-800">
              <p>Yield: {formatPercentage(security.yield)}</p>
              <p>Duration: {security.duration} months</p>
              {projectedReturns > 0 && (
                <p className="font-semibold mt-2">
                  Projected Returns: {formatCurrency(projectedReturns)}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+256 XXX XXX XXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Investment Amount (UGX)
              </label>
              <input
                type="number"
                value={formData.investmentAmount}
                onChange={(e) => setFormData({ ...formData, investmentAmount: parseInt(e.target.value) || security.minimumInvestment })}
                min={security.minimumInvestment}
                step="1000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum: {formatCurrency(security.minimumInvestment)}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <p className="text-sm text-gray-600">
              By submitting this form, you're expressing interest in this security. 
              A broker or primary dealer will contact you within 24 hours to discuss your investment options.
            </p>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Interest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};