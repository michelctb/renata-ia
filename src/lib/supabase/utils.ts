import { supabase, CLIENTES_TABLE } from './client';

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
