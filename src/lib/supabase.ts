
import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://mpyprutumezvlnwtbaxu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1weXBydXR1bWV6dmxud3RiYXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNTI4NTYsImV4cCI6MjA1NTgyODg1Nn0.PJIBQpQBQ4JYJboGIBl2FWS2Pv79q5rnOSDtTQhuHgo';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Table name
export const FINANCIAL_TABLE = 'Sistema Financeiro';

// Types for financial records
export type Transaction = {
  id?: number;
  cliente: string;
  created_at?: string;
  data: string;
  operação: 'entrada' | 'saída';
  descrição: string;
  categoria: string;
  valor: number;
};

// Fetch transactions for a specific user
export async function fetchTransactions(userId: string) {
  const { data, error } = await supabase
    .from(FINANCIAL_TABLE)
    .select('*')
    .eq('cliente', userId)
    .order('data', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  return data || [];
}

// Add a new transaction
export async function addTransaction(transaction: Transaction) {
  const { data, error } = await supabase
    .from(FINANCIAL_TABLE)
    .insert([transaction])
    .select();

  if (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }

  return data?.[0];
}

// Update an existing transaction
export async function updateTransaction(transaction: Transaction) {
  const { data, error } = await supabase
    .from(FINANCIAL_TABLE)
    .update(transaction)
    .eq('id', transaction.id)
    .select();

  if (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }

  return data?.[0];
}

// Delete a transaction
export async function deleteTransaction(id: number) {
  const { error } = await supabase
    .from(FINANCIAL_TABLE)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }

  return true;
}
