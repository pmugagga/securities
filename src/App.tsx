import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { SecurityCard } from './components/SecurityCard';
import { AdminPanel } from './components/AdminPanel';
import { LeadsPanel } from './components/LeadsPanel';
import { mockSecurities } from './data/mockSecurities';
import { Security, InvestorLead, FilterOptions, SortOption } from './types';

function App() {
  const [securities, setSecurities] = useState<Security[]>(mockSecurities);
  const [leads, setLeads] = useState<InvestorLead[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads'>('dashboard');
  
  const [filters, setFilters] = useState<FilterOptions>({
    type: '',
    minDuration: 0,
    maxDuration: 240,
    minInterestRate: 0,
    maxInterestRate: 25,
    issuer: '',
    minInvestment: 0,
    searchTerm: ''
  });

  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'yield',
    direction: 'desc'
  });

  const filteredAndSortedSecurities = useMemo(() => {
    let filtered = securities.filter(security => {
      if (filters.type && security.type !== filters.type) return false;
      if (security.duration < filters.minDuration || security.duration > filters.maxDuration) return false;
      if (security.interestRate < filters.minInterestRate || security.interestRate > filters.maxInterestRate) return false;
      if (filters.issuer && security.issuer !== filters.issuer) return false;
      if (security.minimumInvestment < filters.minInvestment) return false;
      if (filters.searchTerm && !security.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      const aValue = a[sortOption.field];
      const bValue = b[sortOption.field];
      
      if (sortOption.field === 'maturityDate') {
        const comparison = new Date(aValue as string).getTime() - new Date(bValue as string).getTime();
        return sortOption.direction === 'asc' ? comparison : -comparison;
      }
      
      const comparison = (aValue as number) - (bValue as number);
      return sortOption.direction === 'asc' ? comparison : -comparison;
    });
  }, [securities, filters, sortOption]);

  const handleExpressInterest = (securityId: string, amount: number, tenor: number, projectedReturns: number) => {
    // In a real application, this would be handled by the InterestModal
    console.log('Interest expressed:', { securityId, amount, tenor, projectedReturns });
  };

  const handleAddLead = (lead: Omit<InvestorLead, 'id' | 'createdAt' | 'status'>) => {
    const newLead: InvestorLead = {
      ...lead,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const handleUpdateLeadStatus = (leadId: string, status: 'pending' | 'contacted' | 'converted') => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status } : lead
    ));
  };

  // Add a global event listener for form submissions from InterestModal
  React.useEffect(() => {
    const handleInterestSubmit = (event: CustomEvent) => {
      const { securityId, fullName, email, phone, investmentAmount, selectedTenor, projectedReturns } = event.detail;
      handleAddLead({
        securityId,
        fullName,
        email,
        phone,
        investmentAmount,
        selectedTenor,
        projectedReturns
      });
    };

    window.addEventListener('interestSubmit', handleInterestSubmit as EventListener);
    return () => window.removeEventListener('interestSubmit', handleInterestSubmit as EventListener);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onToggleAdmin={() => setIsAdminMode(!isAdminMode)} isAdminMode={isAdminMode} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAdminMode ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Invest in Uganda Government Securities
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Secure your financial future with government-backed treasury bills and bonds. 
                Calculate returns, compare options, and express interest with leading brokers and primary dealers.
              </p>
            </div>

            <FilterBar
              filters={filters}
              onFiltersChange={setFilters}
              sortOption={sortOption}
              onSortChange={setSortOption}
            />

            {/* Securities Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredAndSortedSecurities.map((security) => (
                <SecurityCard
                  key={security.id}
                  security={security}
                  onExpressInterest={handleExpressInterest}
                />
              ))}
            </div>

            {filteredAndSortedSecurities.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No securities found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results.</p>
              </div>
            )}
          
        ) : (
          <div className="space-y-8">
            <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Securities Management
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'leads' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Investor Leads ({leads.length})
              </button>
            </div>

            {activeTab === 'dashboard' ? (
              <AdminPanel securities={securities} onUpdateSecurities={setSecurities} />
            ) : (
              <LeadsPanel 
                leads={leads} 
                securities={securities} 
                onUpdateLeadStatus={handleUpdateLeadStatus} 
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;