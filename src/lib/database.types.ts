export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      securities: {
        Row: {
          id: string
          type: 'government_bond' | 'treasury_bill'
          name: string
          issuer: string
          interest_rate: number
          minimum_investment: number
          maturity_date: string
          duration: number
          yield: number
          issuance_date: string
          status: 'active' | 'closed' | 'upcoming'
          description: string | null
          risk_rating: 'low' | 'medium' | 'high'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'government_bond' | 'treasury_bill'
          name: string
          issuer: string
          interest_rate: number
          minimum_investment: number
          maturity_date: string
          duration: number
          yield: number
          issuance_date?: string
          status?: 'active' | 'closed' | 'upcoming'
          description?: string | null
          risk_rating?: 'low' | 'medium' | 'high'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'government_bond' | 'treasury_bill'
          name?: string
          issuer?: string
          interest_rate?: number
          minimum_investment?: number
          maturity_date?: string
          duration?: number
          yield?: number
          issuance_date?: string
          status?: 'active' | 'closed' | 'upcoming'
          description?: string | null
          risk_rating?: 'low' | 'medium' | 'high'
          created_at?: string
          updated_at?: string
        }
      }
      investor_leads: {
        Row: {
          id: string
          security_id: string
          full_name: string
          email: string
          phone: string
          investment_amount: number
          selected_tenor: number
          projected_returns: number
          status: 'pending' | 'contacted' | 'converted'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          security_id: string
          full_name: string
          email: string
          phone: string
          investment_amount: number
          selected_tenor: number
          projected_returns: number
          status?: 'pending' | 'contacted' | 'converted'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          security_id?: string
          full_name?: string
          email?: string
          phone?: string
          investment_amount?: number
          selected_tenor?: number
          projected_returns?: number
          status?: 'pending' | 'contacted' | 'converted'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}