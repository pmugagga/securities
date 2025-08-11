import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Security } from '../types';

export const useSecurities = () => {
  const [securities, setSecurities] = useState<Security[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSecurities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('securities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedSecurities: Security[] = data.map(item => ({
        id: item.id,
        type: item.type,
        name: item.name,
        issuer: item.issuer,
        interestRate: item.interest_rate,
        minimumInvestment: item.minimum_investment,
        maturityDate: item.maturity_date,
        duration: item.duration,
        yield: item.yield,
        issuanceDate: item.issuance_date,
        status: item.status,
        description: item.description || '',
        riskRating: item.risk_rating
      }));

      setSecurities(formattedSecurities);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addSecurity = async (security: Omit<Security, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('securities')
        .insert({
          type: security.type,
          name: security.name,
          issuer: security.issuer,
          interest_rate: security.interestRate,
          minimum_investment: security.minimumInvestment,
          maturity_date: security.maturityDate,
          duration: security.duration,
          yield: security.yield,
          issuance_date: security.issuanceDate,
          status: security.status,
          description: security.description,
          risk_rating: security.riskRating
        })
        .select()
        .single();

      if (error) throw error;

      const newSecurity: Security = {
        id: data.id,
        type: data.type,
        name: data.name,
        issuer: data.issuer,
        interestRate: data.interest_rate,
        minimumInvestment: data.minimum_investment,
        maturityDate: data.maturity_date,
        duration: data.duration,
        yield: data.yield,
        issuanceDate: data.issuance_date,
        status: data.status,
        description: data.description || '',
        riskRating: data.risk_rating
      };

      setSecurities(prev => [newSecurity, ...prev]);
      return newSecurity;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add security');
    }
  };

  const updateSecurity = async (id: string, updates: Partial<Security>) => {
    try {
      const { data, error } = await supabase
        .from('securities')
        .update({
          ...(updates.type && { type: updates.type }),
          ...(updates.name && { name: updates.name }),
          ...(updates.issuer && { issuer: updates.issuer }),
          ...(updates.interestRate !== undefined && { interest_rate: updates.interestRate }),
          ...(updates.minimumInvestment !== undefined && { minimum_investment: updates.minimumInvestment }),
          ...(updates.maturityDate && { maturity_date: updates.maturityDate }),
          ...(updates.duration !== undefined && { duration: updates.duration }),
          ...(updates.yield !== undefined && { yield: updates.yield }),
          ...(updates.issuanceDate && { issuance_date: updates.issuanceDate }),
          ...(updates.status && { status: updates.status }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.riskRating && { risk_rating: updates.riskRating }),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedSecurity: Security = {
        id: data.id,
        type: data.type,
        name: data.name,
        issuer: data.issuer,
        interestRate: data.interest_rate,
        minimumInvestment: data.minimum_investment,
        maturityDate: data.maturity_date,
        duration: data.duration,
        yield: data.yield,
        issuanceDate: data.issuance_date,
        status: data.status,
        description: data.description || '',
        riskRating: data.risk_rating
      };

      setSecurities(prev => prev.map(s => s.id === id ? updatedSecurity : s));
      return updatedSecurity;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update security');
    }
  };

  const deleteSecurity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('securities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSecurities(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete security');
    }
  };

  useEffect(() => {
    fetchSecurities();
  }, []);

  return {
    securities,
    loading,
    error,
    refetch: fetchSecurities,
    addSecurity,
    updateSecurity,
    deleteSecurity
  };
};