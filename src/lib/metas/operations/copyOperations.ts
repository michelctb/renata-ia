
import { supabase } from '@/integrations/supabase/client';
import { METAS_TABLE } from '../constants';

/**
 * Copia metas de um período anterior para o período atual
 * @param userId ID do usuário
 * @param fromMonth Mês de origem
 * @param fromYear Ano de origem
 * @param toMonth Mês de destino 
 * @param toYear Ano de destino
 * @returns Array das metas copiadas
 */
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
