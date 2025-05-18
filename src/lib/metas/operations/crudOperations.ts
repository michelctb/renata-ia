
import { supabase } from '@/integrations/supabase/client';
import { MetaCategoria } from '../types';
import { METAS_TABLE } from '../constants';

/**
 * Adiciona uma nova meta
 * @param meta Objeto com dados da meta a ser adicionada
 * @returns Meta adicionada com o ID gerado
 */
export async function addMetaCategoria(meta: MetaCategoria) {
  console.log('Adicionando meta:', meta);
  
  if (!meta.id_cliente || !meta.categoria || meta.valor_meta === undefined) {
    console.error('Dados de meta incompletos:', meta);
    throw new Error('Dados de meta incompletos');
  }
  
  // Create a clean object for insertion, removing the id if it's undefined
  const metaToInsert = { ...meta };
  if (metaToInsert.id === undefined) {
    delete metaToInsert.id; // Remove the id property completely if it's undefined
  }
  
  const { data, error } = await supabase
    .from(METAS_TABLE)
    .insert([metaToInsert])
    .select();

  if (error) {
    console.error('Erro ao adicionar meta:', error);
    throw error;
  }

  console.log('Meta adicionada com sucesso:', data?.[0]);
  return data?.[0];
}

/**
 * Atualiza uma meta existente
 * @param meta Objeto com dados da meta a ser atualizada
 * @returns Meta atualizada
 */
export async function updateMetaCategoria(meta: MetaCategoria) {
  console.log('Atualizando meta:', meta);
  
  if (!meta.id) {
    console.error('ID da meta é necessário para atualização');
    throw new Error('ID da meta é necessário para atualização');
  }

  const { data, error } = await supabase
    .from(METAS_TABLE)
    .update({
      categoria: meta.categoria,
      valor_meta: meta.valor_meta,
      periodo: meta.periodo,
      mes_referencia: meta.mes_referencia,
      ano_referencia: meta.ano_referencia
    })
    .eq('id', meta.id)
    .select();

  if (error) {
    console.error('Erro ao atualizar meta:', error);
    throw error;
  }

  console.log('Meta atualizada com sucesso:', data?.[0]);
  return data?.[0];
}

/**
 * Exclui uma meta
 * @param id ID da meta a ser excluída
 * @returns true se exclusão for bem-sucedida
 */
export async function deleteMetaCategoria(id: number) {
  console.log('Excluindo meta:', id);
  
  const { error } = await supabase
    .from(METAS_TABLE)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir meta:', error);
    throw error;
  }

  return true;
}
