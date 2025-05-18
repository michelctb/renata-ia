
import { supabase } from '@/integrations/supabase/client';
import { MetaCategoria } from '../types';
import { METAS_TABLE } from '../constants';

/**
 * Busca todas as metas de um usuário
 * @param userId ID do usuário
 * @returns Array de metas do usuário
 */
export async function fetchMetasCategorias(userId: string) {
  console.log('Buscando metas para o usuário:', userId);
  
  const { data, error } = await supabase
    .from(METAS_TABLE)
    .select('*')
    .eq('id_cliente', userId)
    .order('categoria');

  if (error) {
    console.error('Erro ao buscar metas:', error);
    throw error;
  }

  return data || [];
}

/**
 * Busca metas com filtro de período
 * @param userId ID do usuário
 * @param periodo Período da meta ('mensal', 'trimestral', 'anual')
 * @param mes Mês de referência (para metas mensais)
 * @param ano Ano de referência
 * @returns Array de metas filtradas por período
 */
export async function fetchMetasPeriodo(userId: string, periodo: string, mes?: number, ano?: number) {
  console.log(`Buscando metas ${periodo} para o usuário:`, userId);
  
  let query = supabase
    .from(METAS_TABLE)
    .select('*')
    .eq('id_cliente', userId)
    .eq('periodo', periodo);
  
  if (periodo === 'mensal' && mes !== undefined && ano !== undefined) {
    query = query
      .eq('mes_referencia', mes)
      .eq('ano_referencia', ano);
  } else if (periodo === 'anual' && ano !== undefined) {
    query = query.eq('ano_referencia', ano);
  }
  
  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar metas por período:', error);
    throw error;
  }

  return data || [];
}
