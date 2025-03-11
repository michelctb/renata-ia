
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
  console.log('Fetching transactions for user:', userId);
  
  const { data, error } = await supabase
    .from(FINANCIAL_TABLE)
    .select('*')
    .eq('cliente', userId)  // Explicitly filter by user ID despite RLS
    .order('data', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  console.log('Transactions fetched:', data?.length || 0);
  return data || [];
}

// Add a new transaction
export async function addTransaction(transaction: Transaction) {
  console.log('Adding transaction:', transaction);
  
  if (!transaction.cliente) {
    console.error('Error: cliente field is required');
    throw new Error('Cliente field is required');
  }
  
  // Garantir que todos os campos necessários estejam presentes
  const { cliente, data, operação, descrição, categoria, valor } = transaction;
  
  if (!cliente || !data || !operação || !descrição || !categoria || valor === undefined) {
    console.error('Error: missing required fields', transaction);
    throw new Error('Campos obrigatórios faltando');
  }
  
  // Create a transaction object without the ID field to let the database auto-generate it
  const { id, ...transactionWithoutId } = transaction;
  console.log('Submitting transaction without ID:', transactionWithoutId);
  
  const { data: insertedData, error } = await supabase
    .from(FINANCIAL_TABLE)
    .insert([transactionWithoutId])
    .select();

  if (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }

  console.log('Transaction added successfully:', insertedData?.[0]);
  return insertedData?.[0];
}

// Update an existing transaction
export async function updateTransaction(transaction: Transaction) {
  console.log('Updating transaction:', transaction);
  
  if (!transaction.cliente) {
    console.error('Error: cliente field is required');
    throw new Error('Cliente field is required');
  }
  
  if (!transaction.id) {
    console.error('Error: transaction id is required for update');
    throw new Error('Transaction ID is required for update');
  }
  
  const { data, error } = await supabase
    .from(FINANCIAL_TABLE)
    .update(transaction)
    .eq('id', transaction.id)
    .select();

  if (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }

  console.log('Transaction updated successfully:', data?.[0]);
  return data?.[0];
}

// Delete a transaction
export async function deleteTransaction(id: number) {
  console.log('Deleting transaction:', id);
  
  const { error } = await supabase
    .from(FINANCIAL_TABLE)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }

  console.log('Transaction deleted successfully');
  return true;
}
