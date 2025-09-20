import React from 'react';
import { Mail, Phone, User, Calendar, TrendingUp } from 'lucide-react';
import { InvestorLead, Security } from '../types';
import { formatCurrency, formatDate } from '../utils/calculations';

interface LeadsPanelProps {
  leads: InvestorLead[];
  securities: Security[];
  onUpdateLeadStatus: (leadId: string, status: 'pending' | 'contacted' | 'converted') => void;
  loading: boolean;
}

export const LeadsPanel: React.FC<LeadsPanelProps> = ({ leads, securities, onUpdateLeadStatus, loading }) => {
  const getSecurityName = (securityId: string) => {
    const security = securities.find(s => s.id === securityId);
    return security?.name || 'Unknown Security';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'converted':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Investor Leads</h2>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {leads.length} Total Leads
        </span>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading leads...</p>
          </div>
        ) : (
          <>
        {leads.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No investor leads yet.</p>
          </div>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    {lead.fullName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{getSecurityName(lead.securityId)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                  <select
                    value={lead.status}
                    onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as 'pending' | 'contacted' | 'converted')}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href={`mailto:${lead.email}`} className="hover:text-blue-600">{lead.email}</a>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <a href={`tel:${lead.phone}`} className="hover:text-blue-600">{lead.phone}</a>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(new Date(lead.createdAt))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded p-3">
                <div>
                  <span className="text-xs text-gray-500">Investment Amount</span>
                  <div className="font-semibold text-gray-900">{formatCurrency(lead.investmentAmount)}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Selected Tenor</span>
                  <div className="font-semibold text-gray-900">{lead.selectedTenor} months</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Projected Returns</span>
                  <div className="font-semibold text-green-600">{formatCurrency(lead.projectedReturns)}</div>
                </div>
              </div>
            </div>
          ))
        )}
          </>
        )}
      </div>
    </div>
  );
};