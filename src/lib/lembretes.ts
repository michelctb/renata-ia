
import { supabase } from '@/integrations/supabase/client';

// Table name
export const LEMBRETES_TABLE = 'Lembretes';

// Types for lembretes records
export type Lembrete = {
  id?: number;
  lembrete: string;
  tipo: string;
  valor?: number;
  telefone: string;
  cliente: string;
  vencimento: string;
  lembrar: string;
};

// Fetch lembretes for a specific user
export async function fetchLembretes(userId: string) {
  console.log('Fetching lembretes for user:', userId);
  
  const { data, error } = await supabase
    .from(LEMBRETES_TABLE)
    .select('*')
    .eq('telefone', userId)
    .order('vencimento', { ascending: true });

  if (error) {
    console.error('Error fetching lembretes:', error);
    throw error;
  }

  console.log('Lembretes fetched:', data?.length || 0);
  return data || [];
}

// Add a new lembrete
export async function addLembrete(lembrete: Lembrete) {
  console.log('Adding lembrete:', lembrete);
  
  if (!lembrete.telefone) {
    console.error('Error: telefone field is required');
    throw new Error('Telefone field is required');
  }
  
  // Create a lembrete object without the ID field to let the database auto-generate it
  const { id, ...lembreteWithoutId } = lembrete;
  console.log('Submitting lembrete without ID:', lembreteWithoutId);
  
  const { data: insertedData, error } = await supabase
    .from(LEMBRETES_TABLE)
    .insert([lembreteWithoutId])
    .select();

  if (error) {
    console.error('Error adding lembrete:', error);
    throw error;
  }

  console.log('Lembrete added successfully:', insertedData?.[0]);
  return insertedData?.[0];
}

// Update an existing lembrete
export async function updateLembrete(lembrete: Lembrete) {
  console.log('Updating lembrete:', lembrete);
  
  if (!lembrete.telefone) {
    console.error('Error: telefone field is required');
    throw new Error('Telefone field is required');
  }
  
  if (!lembrete.id) {
    console.error('Error: lembrete id is required for update');
    throw new Error('Lembrete ID is required for update');
  }
  
  // Since we've already checked that lembrete.id exists and isn't falsy,
  // we can safely assert it as a number for TypeScript
  const id = lembrete.id as number;
  
  console.log('Using ID for update:', id);
  
  const { data, error } = await supabase
    .from(LEMBRETES_TABLE)
    .update({
      lembrete: lembrete.lembrete,
      tipo: lembrete.tipo,
      valor: lembrete.valor,
      telefone: lembrete.telefone,
      cliente: lembrete.cliente,
      vencimento: lembrete.vencimento,
      lembrar: lembrete.lembrar
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating lembrete:', error);
    throw error;
  }

  console.log('Lembrete updated successfully:', data?.[0]);
  return data?.[0];
}

// Delete a lembrete
export async function deleteLembrete(id: number) {
  console.log('Deleting lembrete:', id);
  
  const { error } = await supabase
    .from(LEMBRETES_TABLE)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting lembrete:', error);
    throw error;
  }

  console.log('Lembrete deleted successfully');
  return true;
}
