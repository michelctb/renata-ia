
import { supabase } from '@/integrations/supabase/client';
import { MetaCategoria } from './types';
import { METAS_TABLE } from './constants';

// Buscar todas as metas de um usuário
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

// Buscar metas com filtro de período
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

// Adicionar uma nova meta
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

// Atualizar uma meta existente
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

// Excluir uma meta
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

// Copiar metas de um período anterior para o período atual
export async function copyMetasFromPreviousPeriod(
  userId: string, 
  fromMonth: number, 
  fromYear: number, 
  toMonth: number, 
  toYear: number
) {
  console.log(`Copiando metas de ${fromMonth}/${fromYear} para ${toMonth}/${toYear} para o usuário ${userId}`);
  
  try {
    // 1. Buscar metas do período de origem
    const { data: sourceMetas, error: sourceError } = await supabase
      .from(METAS_TABLE)
      .select('*')
      .eq('id_cliente', userId)
      .eq('periodo', 'mensal')
      .eq('mes_referencia', fromMonth)
      .eq('ano_referencia', fromYear);
    
    if (sourceError) {
      console.error('Erro ao buscar metas de origem:', sourceError);
      throw sourceError;
    }
    
    if (!sourceMetas || sourceMetas.length === 0) {
      console.warn('Não foram encontradas metas para copiar no período selecionado');
      throw new Error('Não foram encontradas metas para copiar no período selecionado');
    }
    
    console.log(`Encontradas ${sourceMetas.length} metas para copiar`);
    
    // 2. Verificar se já existem metas para o período de destino
    const { data: existingMetas, error: existingError } = await supabase
      .from(METAS_TABLE)
      .select('categoria')
      .eq('id_cliente', userId)
      .eq('periodo', 'mensal')
      .eq('mes_referencia', toMonth)
      .eq('ano_referencia', toYear);
    
    if (existingError) {
      console.error('Erro ao verificar metas existentes:', existingError);
      throw existingError;
    }
    
    // Criar um conjunto de categorias que já têm metas no período de destino
    const existingCategories = new Set(existingMetas?.map(m => m.categoria) || []);
    
    // 3. Preparar novas metas para inserir (apenas as que não existem no destino)
    const metasToInsert = sourceMetas
      .filter(meta => !existingCategories.has(meta.categoria))
      .map(meta => ({
        id_cliente: userId,
        categoria: meta.categoria,
        valor_meta: meta.valor_meta,
        periodo: 'mensal',
        mes_referencia: toMonth,
        ano_referencia: toYear
      }));
    
    if (metasToInsert.length === 0) {
      console.warn('Todas as categorias já possuem metas para o período de destino');
      throw new Error('Todas as categorias já possuem metas para o período de destino');
    }
    
    // 4. Inserir as novas metas
    const { data: insertedMetas, error: insertError } = await supabase
      .from(METAS_TABLE)
      .insert(metasToInsert)
      .select();
    
    if (insertError) {
      console.error('Erro ao inserir novas metas:', insertError);
      throw insertError;
    }
    
    console.log(`${insertedMetas?.length || 0} metas copiadas com sucesso`);
    return insertedMetas || [];
    
  } catch (error) {
    console.error('Erro ao copiar metas:', error);
    throw error;
  }
}
