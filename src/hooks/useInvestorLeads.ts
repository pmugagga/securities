import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { InvestorLead } from '../types';

export const useInvestorLeads = () => {
  const [leads, setLeads] = useState<InvestorLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('investor_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedLeads: InvestorLead[] = data.map(item => ({
        id: item.id,
        securityId: item.security_id,
        fullName: item.full_name,
        email: item.email,
        phone: item.phone,
        investmentAmount: item.investment_amount,
        selectedTenor: item.selected_tenor,
        projectedReturns: item.projected_returns,
        status: item.status,
        createdAt: item.created_at
      }));

      setLeads(formattedLeads);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addLead = async (lead: Omit<InvestorLead, 'id' | 'createdAt' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('investor_leads')
        .insert({
          security_id: lead.securityId,
          full_name: lead.fullName,
          email: lead.email,
          phone: lead.phone,
          investment_amount: lead.investmentAmount,
          selected_tenor: lead.selectedTenor,
          projected_returns: lead.projectedReturns,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      const newLead: InvestorLead = {
        id: data.id,
        securityId: data.security_id,
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        investmentAmount: data.investment_amount,
        selectedTenor: data.selected_tenor,
        projectedReturns: data.projected_returns,
        status: data.status,
        createdAt: data.created_at
      };

      setLeads(prev => [newLead, ...prev]);
      return newLead;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add lead');
    }
  };

  const updateLeadStatus = async (id: string, status: 'pending' | 'contacted' | 'converted') => {
    try {
      const { data, error } = await supabase
        .from('investor_leads')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedLead: InvestorLead = {
        id: data.id,
        securityId: data.security_id,
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        investmentAmount: data.investment_amount,
        selectedTenor: data.selected_tenor,
        projectedReturns: data.projected_returns,
        status: data.status,
        createdAt: data.created_at
      };

      setLeads(prev => prev.map(l => l.id === id ? updatedLead : l));
      return updatedLead;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update lead status');
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('investor_leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLeads(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete lead');
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return {
    leads,
    loading,
    error,
    refetch: fetchLeads,
    addLead,
    updateLeadStatus,
    deleteLead
  };
};