import { supabase, FINANCIAL_TABLE } from './client';
import { Transaction } from './types';
import { formatPhoneForWhatsApp, getClientPhone } from './utils';

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

// Fetch transactions for a client by their ID (used by consultors)
export async function fetchTransactionsByClientId(clientId: string) {
  console.log('Fetching transactions for client:', clientId);
  
  const { data, error } = await supabase
    .from(FINANCIAL_TABLE)
    .select('*')
    .eq('id_cliente', clientId)
    .order('data', { ascending: false });

  if (error) {
    console.error('Error fetching client transactions:', error);
    throw error;
  }

  console.log('Client transactions fetched:', data?.length || 0);
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
