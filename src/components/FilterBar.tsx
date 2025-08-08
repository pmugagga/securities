import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { FilterOptions, SortOption } from '../types';
import { securityTypes, issuers } from '../data/mockSecurities';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFiltersChange,
  sortOption,
  onSortChange
}) => {
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Filters & Search
        </h2>
        <button
          onClick={() => onFiltersChange({
            type: '',
            minDuration: 0,
            maxDuration: 240,
            minInterestRate: 0,
            maxInterestRate: 25,
            issuer: '',
            minInvestment: 0,
            searchTerm: ''
          })}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search securities..."
          value={filters.searchTerm}
          onChange={(e) => updateFilter('searchTerm', e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            value={filters.type}
            onChange={(e) => updateFilter('type', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {securityTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Issuer</label>
          <select
            value={filters.issuer}
            onChange={(e) => updateFilter('issuer', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Issuers</option>
            {issuers.map(issuer => (
              <option key={issuer} value={issuer}>{issuer}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Min Duration (months)</label>
          <input
            type="number"
            value={filters.minDuration}
            onChange={(e) => updateFilter('minDuration', parseInt(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Duration (months)</label>
          <input
            type="number"
            value={filters.maxDuration}
            onChange={(e) => updateFilter('maxDuration', parseInt(e.target.value) || 240)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Min Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={filters.minInterestRate}
            onChange={(e) => updateFilter('minInterestRate', parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={filters.maxInterestRate}
            onChange={(e) => updateFilter('maxInterestRate', parseFloat(e.target.value) || 25)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        <select
          value={sortOption.field}
          onChange={(e) => onSortChange({ ...sortOption, field: e.target.value as SortOption['field'] })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="yield">Yield</option>
          <option value="duration">Duration</option>
          <option value="interestRate">Interest Rate</option>
          <option value="minimumInvestment">Minimum Investment</option>
          <option value="maturityDate">Maturity Date</option>
        </select>
        <button
          onClick={() => onSortChange({ ...sortOption, direction: sortOption.direction === 'asc' ? 'desc' : 'asc' })}
          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
        >
          {sortOption.direction === 'asc' ? '↑' : '↓'} {sortOption.direction === 'asc' ? 'Ascending' : 'Descending'}
        </button>
      </div>
    </div>
  );
};