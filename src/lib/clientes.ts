
import { supabase } from '@/integrations/supabase/client';

// Table name
export const CLIENTES_TABLE = 'Clientes';

// Types for client records
export type Cliente = {
  id_cliente: string;
  nome?: string;
  telefone?: string;
  email?: string;
  cpf?: number;
  ativo?: boolean;
  plano?: string;
  lembrete?: string;
  perfil?: 'user' | 'adm' | 'consultor';
  consultor?: string;
  created_at?: string;
};

// Fetch all clients
export async function fetchClientes() {
  console.log('Fetching all clients');
  
  const { data, error } = await supabase
    .from(CLIENTES_TABLE)
    .select('*')
    .order('nome', { ascending: true });

  if (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }

  console.log('Clients fetched:', data?.length || 0);
  return data || [];
}

// Fetch all users for a consultant
export async function fetchConsultorClients(consultorId: string) {
  console.log('Fetching clients for consultant:', consultorId);
  
  const { data, error } = await supabase
    .from(CLIENTES_TABLE)
    .select('*')
    .eq('consultor', consultorId)
    .order('nome', { ascending: true });

  if (error) {
    console.error('Error fetching consultant clients:', error);
    throw error;
  }

  console.log(`Clients fetched for consultant ${consultorId}:`, data?.length || 0);
  return data || [];
}

// Fetch a client by ID
export async function fetchClienteById(id_cliente: string) {
  console.log('Fetching client with ID:', id_cliente);
  
  const { data, error } = await supabase
    .from(CLIENTES_TABLE)
    .select('*')
    .eq('id_cliente', id_cliente)
    .single();

  if (error) {
    console.error('Error fetching client:', error);
    throw error;
  }

  console.log('Client fetched:', data);
  return data;
}

// Add a new client
export async function addCliente(cliente: Cliente) {
  console.log('Adding client:', cliente);
  
  if (!cliente.id_cliente) {
    console.error('Error: id_cliente field is required');
    throw new Error('id_cliente field is required');
  }
  
  const { data, error } = await supabase
    .from(CLIENTES_TABLE)
    .insert([cliente])
    .select();

  if (error) {
    console.error('Error adding client:', error);
    throw error;
  }

  console.log('Client added successfully:', data?.[0]);
  return data?.[0];
}

// Update an existing client
export async function updateCliente(cliente: Cliente) {
  console.log('Updating client:', cliente);
  
  if (!cliente.id_cliente) {
    console.error('Error: id_cliente field is required');
    throw new Error('id_cliente field is required');
  }
  
  const { data, error } = await supabase
    .from(CLIENTES_TABLE)
    .update({
      nome: cliente.nome,
      telefone: cliente.telefone,
      email: cliente.email,
      cpf: cliente.cpf,
      ativo: cliente.ativo,
      plano: cliente.plano,
      lembrete: cliente.lembrete,
      perfil: cliente.perfil,
      consultor: cliente.consultor
    })
    .eq('id_cliente', cliente.id_cliente)
    .select();

  if (error) {
    console.error('Error updating client:', error);
    throw error;
  }

  console.log('Client updated successfully:', data?.[0]);
  return data?.[0];
}

// Delete a client
export async function deleteCliente(id_cliente: string) {
  console.log('Deleting client:', id_cliente);
  
  const { error } = await supabase
    .from(CLIENTES_TABLE)
    .delete()
    .eq('id_cliente', id_cliente);

  if (error) {
    console.error('Error deleting client:', error);
    throw error;
  }

  console.log('Client deleted successfully');
  return true;
}
