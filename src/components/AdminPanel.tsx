import React, { useState } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, Save, X } from 'lucide-react';
import { Security } from '../types';
import { formatCurrency, formatPercentage, formatDate } from '../utils/calculations';

interface AdminPanelProps {
  securities: Security[];
  onAddSecurity: (security: Omit<Security, 'id'>) => Promise<Security>;
  onUpdateSecurity: (id: string, updates: Partial<Security>) => Promise<Security>;
  onDeleteSecurity: (id: string) => Promise<void>;
  loading: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  securities, 
  onAddSecurity, 
  onUpdateSecurity, 
  onDeleteSecurity,
  loading 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Security>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (security: Security) => {
    setEditingId(security.id);
    setFormData(security);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      if (editingId) {
        await onUpdateSecurity(editingId, formData);
      } else {
        const newSecurityData = {
        type: formData.type as 'government_bond' | 'treasury_bill',
        name: formData.name || '',
        issuer: formData.issuer || '',
        interestRate: formData.interestRate || 0,
        minimumInvestment: formData.minimumInvestment || 0,
        maturityDate: formData.maturityDate || '',
        duration: formData.duration || 0,
        yield: formData.yield || 0,
        issuanceDate: formData.issuanceDate || new Date().toISOString().split('T')[0],
        status: formData.status as 'active' | 'closed' | 'upcoming' || 'active',
        description: formData.description || '',
        riskRating: formData.riskRating as 'low' | 'medium' | 'high' || 'low'
        };
        await onAddSecurity(newSecurityData);
      }
    } catch (error) {
      alert('Error saving security: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
    setEditingId(null);
    setShowAddForm(false);
    setFormData({});
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this security?')) {
      try {
        await onDeleteSecurity(id);
      } catch (error) {
        alert('Error deleting security: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({});
  };

  const simulateApiUpdate = () => {
    alert('API update simulated! In a real application, this would fetch the latest securities data.');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Securities Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={simulateApiUpdate}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Update from API
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Security
          </button>
        </div>
      </div>

      {(showAddForm || editingId) && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Security' : 'Add New Security'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'government_bond' | 'treasury_bill' })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select Type</option>
                <option value="government_bond">Government Bond</option>
                <option value="treasury_bill">Treasury Bill</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issuer</label>
              <input
                type="text"
                value={formData.issuer || ''}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.interestRate || ''}
                onChange={(e) => setFormData({ ...formData, interestRate: parseFloat(e.target.value) })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Investment</label>
              <input
                type="number"
                value={formData.minimumInvestment || ''}
                onChange={(e) => setFormData({ ...formData, minimumInvestment: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
              <input
                type="number"
                value={formData.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yield (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.yield || ''}
                onChange={(e) => setFormData({ ...formData, yield: parseFloat(e.target.value) })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maturity Date</label>
              <input
                type="date"
                value={formData.maturityDate || ''}
                onChange={(e) => setFormData({ ...formData, maturityDate: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'closed' | 'upcoming' })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={2}
            />
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading securities...</p>
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Rate</th>
              <th className="px-6 py-3">Duration</th>
              <th className="px-6 py-3">Min Investment</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {securities.map((security) => (
              <tr key={security.id} className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900">{security.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    security.type === 'government_bond' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {security.type === 'government_bond' ? 'Bond' : 'T-Bill'}
                  </span>
                </td>
                <td className="px-6 py-4">{formatPercentage(security.interestRate)}</td>
                <td className="px-6 py-4">{security.duration}m</td>
                <td className="px-6 py-4">{formatCurrency(security.minimumInvestment)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    security.status === 'active' ? 'bg-green-100 text-green-800' :
                    security.status === 'closed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {security.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(security)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(security.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};