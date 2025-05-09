
import { supabase } from '@/integrations/supabase/client';
import { Lembrete } from './types';
import { LEMBRETES_TABLE } from './constants';

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
  
  // Create a lembrete object without the ID field since it's auto-generated
  // Remove id field for insert as it's auto-generated
  const { id, ...lembreteDataForInsert } = lembrete;
  
  console.log('Submitting lembrete data:', lembreteDataForInsert);
  
  try {
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
  } catch (err) {
    console.error('Exception adding lembrete:', err);
    throw err;
  }
}

// Update an existing lembrete
export async function updateLembrete(lembrete: Lembrete) {
  console.log('Updating lembrete:', lembrete);
  
  if (!lembrete.id) {
    console.error('Error: lembrete id is required for update');
    throw new Error('Lembrete ID is required for update');
  }
  
  const id = lembrete.id;
  
  console.log('Using ID for update:', id);
  
  try {
    // Create a complete update payload
    const updateData = {
      lembrete: lembrete.lembrete,
      tipo: lembrete.tipo,
      valor: lembrete.valor,
      telefone: lembrete.telefone,
      cliente: lembrete.cliente,
      vencimento: lembrete.vencimento,
      lembrar: lembrete.lembrar,
      id_cliente: lembrete.id_cliente
    };
    
    console.log('Update payload:', updateData);
    
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
  } catch (err) {
    console.error('Exception updating lembrete:', err);
    throw err;
  }
}

// Delete a lembrete
export async function deleteLembrete(id: number) {
  console.log('Deleting lembrete with ID:', id);
  
  if (!id) {
    console.error('Error: lembrete id is required for deletion');
    throw new Error('Lembrete ID is required for deletion');
  }
  
  try {
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
  } catch (err) {
    console.error('Exception deleting lembrete:', err);
    throw err;
  }
}
