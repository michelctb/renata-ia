
import { supabase } from '@/integrations/supabase/client';

// Table name
export const LEMBRETES_TABLE = 'Lembretes';

// Types for lembretes records
export type Lembrete = {
  id?: number;
  lembrete: string;
  tipo: string;
  valor?: number;
  telefone?: string; // Used by the trigger to find the correct client ID
  cliente?: string; // Mantido para compatibilidade
  id_cliente?: string; // Made optional since it's filled automatically by the trigger
  vencimento: string;
  lembrar: string;
};

// Fetch lembretes for a specific user
export async function fetchLembretes(userId: string) {
  console.log('Fetching lembretes for user:', userId);
  
  const { data, error } = await supabase
    .from(LEMBRETES_TABLE)
    .select('*')
    .eq('id_cliente', userId)
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
  
  // Create a lembrete object without the ID and id_cliente fields
  // id_cliente will be set by the database trigger
  const { id, id_cliente, ...lembreteDataForInsert } = lembrete;
  console.log('Submitting lembrete without ID and id_cliente:', lembreteDataForInsert);
  
  const { data: insertedData, error } = await supabase
    .from(LEMBRETES_TABLE)
    .insert([lembreteDataForInsert])
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
  
  if (!lembrete.id) {
    console.error('Error: lembrete id is required for update');
    throw new Error('Lembrete ID is required for update');
  }
  
  const id = lembrete.id as number;
  
  console.log('Using ID for update:', id);
  
  // Remove id_cliente from the update payload since it's managed by the database
  const { id: _, id_cliente, ...updateData } = lembrete;
  
  const { data, error } = await supabase
    .from(LEMBRETES_TABLE)
    .update(updateData)
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
