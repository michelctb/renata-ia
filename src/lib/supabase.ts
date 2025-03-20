
import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://mpyprutumezvlnwtbaxu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1weXBydXR1bWV6dmxud3RiYXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNTI4NTYsImV4cCI6MjA1NTgyODg1Nn0.PJIBQpQBQ4JYJboGIBl2FWS2Pv79q5rnOSDtTQhuHgo';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Table name
export const FINANCIAL_TABLE = 'Sistema Financeiro';
export const CLIENTES_TABLE = 'Clientes';

// Types for financial records
export type Transaction = {
  id?: number;
  cliente?: string; // Mantido para compatibilidade
  id_cliente: string; // Novo campo para identificar o cliente
  created_at?: string;
  data: string;
  operação: 'entrada' | 'saída';
  descrição: string;
  categoria: string;
  valor: number;
};

// Default WhatsApp suffix for cliente field
const WHATSAPP_SUFFIX = '@s.whatsapp.net';
const DEFAULT_PHONE_PREFIX = '5521'; // Default prefix for phone numbers

// Format phone number for WhatsApp
export function formatPhoneForWhatsApp(userId: string): string {
  // Check if userId is already in WhatsApp format
  if (userId.includes('@s.whatsapp.net')) {
    return userId;
  }
  
  // Check if it's already a full phone number with the prefix
  if (userId.length >= 12 && userId.startsWith('55')) {
    return `${userId}${WHATSAPP_SUFFIX}`;
  }
  
  // Otherwise, add the default prefix
  return `${DEFAULT_PHONE_PREFIX}${userId}${WHATSAPP_SUFFIX}`;
}

// Busca o telefone do cliente pelo id_cliente
export async function getClientPhone(id_cliente: string): Promise<string | null> {
  console.log('Buscando telefone para o cliente ID:', id_cliente);
  
  try {
    const { data, error } = await supabase
      .from(CLIENTES_TABLE)
      .select('telefone')
      .eq('id_cliente', id_cliente)
      .single();

    if (error) {
      console.error('Erro ao buscar telefone do cliente:', error);
      return null;
    }

    console.log('Telefone do cliente encontrado:', data?.telefone);
    return data?.telefone || null;
  } catch (error) {
    console.error('Exceção ao buscar telefone do cliente:', error);
    return null;
  }
}

// Fetch transactions for a specific user
export async function fetchTransactions(userId: string) {
  console.log('Fetching transactions for user:', userId);
  
  const { data, error } = await supabase
    .from(FINANCIAL_TABLE)
    .select('*')
    .eq('id_cliente', userId)  // Usando id_cliente em vez de cliente
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
  
  if (!transaction.id_cliente) {
    console.error('Error: id_cliente field is required');
    throw new Error('id_cliente field is required');
  }
  
  // Garantir que todos os campos necessários estejam presentes
  const { id_cliente, data, operação, descrição, categoria, valor } = transaction;
  
  if (!id_cliente || !data || !operação || !descrição || !categoria || valor === undefined) {
    console.error('Error: missing required fields', transaction);
    throw new Error('Campos obrigatórios faltando');
  }
  
  // Buscar o telefone do cliente do banco de dados
  const clientPhone = await getClientPhone(id_cliente);
  
  // Se não conseguir buscar o telefone, usar o formato padrão
  const clienteFormatted = clientPhone || formatPhoneForWhatsApp(id_cliente);
  
  console.log('Usando telefone do cliente para transação:', clienteFormatted);
  
  // Create a transaction object without the ID field to let the database auto-generate it,
  // and with the properly formatted cliente field
  const { id, ...transactionData } = transaction;
  const transactionWithFormattedClient = {
    ...transactionData,
    cliente: clienteFormatted // Use the formatted phone number for WhatsApp
  };
  
  console.log('Submitting transaction without ID:', transactionWithFormattedClient);
  
  const { data: insertedData, error } = await supabase
    .from(FINANCIAL_TABLE)
    .insert([transactionWithFormattedClient])
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
  
  if (!transaction.id_cliente) {
    console.error('Error: id_cliente field is required');
    throw new Error('id_cliente field is required');
  }
  
  if (!transaction.id) {
    console.error('Error: transaction id is required for update');
    throw new Error('Transaction ID is required for update');
  }
  
  const id = transaction.id as number;
  
  console.log('Using ID for update:', id);
  
  // Buscar o telefone do cliente do banco de dados
  const clientPhone = await getClientPhone(transaction.id_cliente);
  
  // Se não conseguir buscar o telefone, usar o formato padrão
  const clienteFormatted = clientPhone || formatPhoneForWhatsApp(transaction.id_cliente);
  
  console.log('Usando telefone do cliente para atualização:', clienteFormatted);
  
  // Create a copy of the transaction without the id field to prevent it from being included in the update
  const { id: _, ...transactionData } = transaction;
  
  // Ensure cliente field is in the correct format
  const transactionUpdate = {
    ...transactionData,
    cliente: clienteFormatted
  };
  
  const { data, error } = await supabase
    .from(FINANCIAL_TABLE)
    .update(transactionUpdate)
    .eq('id', id)
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
