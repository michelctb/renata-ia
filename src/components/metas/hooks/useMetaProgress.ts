
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { parseISO, isWithinInterval } from 'date-fns';
import { Transaction } from '@/lib/supabase';
import { 
  MetaCategoria, 
  MetaProgresso, 
  LIMITE_BAIXO, 
  LIMITE_MEDIO, 
  LIMITE_ALTO 
} from '@/lib/metas';

/**
 * Custom hook to calculate progress for each spending goal (meta).
 * Compares actual spending against defined goals for the selected period.
 * 
 * @param {MetaCategoria[]} metas - List of spending goals
 * @param {Transaction[]} transactions - List of financial transactions
 * @param {DateRange | null} dateRange - Selected date range for filtering
 * @returns {MetaProgresso[]} Array of spending goals with calculated progress information
 */
export const useMetaProgress = (
  metas: MetaCategoria[],
  transactions: Transaction[],
  dateRange: DateRange | null
) => {
  const [metasProgresso, setMetasProgresso] = useState<MetaProgresso[]>([]);
  
  useEffect(() => {
    if (!metas.length || !transactions.length) {
      setMetasProgresso([]);
      return;
    }
    
    // Filter transactions based on date range
    const filteredTransactions = dateRange?.from 
      ? transactions.filter(transaction => {
          try {
            const transactionDate = parseISO(transaction.data);
            if (dateRange.from && dateRange.to) {
              return isWithinInterval(transactionDate, { 
                start: dateRange.from, 
                end: dateRange.to 
              });
            }
            return transactionDate >= dateRange.from;
          } catch (error) {
            console.error('Erro ao processar data:', transaction.data);
            return false;
          }
        })
      : transactions;
    
    // Filter metas based on date reference
    const dataReferencia = dateRange?.from || new Date();
    const mesReferencia = dataReferencia.getMonth() + 1;
    const anoReferencia = dataReferencia.getFullYear();
    
    const metasFiltradas = metas.filter(meta => {
      if (meta.periodo === 'mensal') {
        return meta.mes_referencia === mesReferencia && meta.ano_referencia === anoReferencia;
      } else if (meta.periodo === 'anual') {
        return meta.ano_referencia === anoReferencia;
      } else if (meta.periodo === 'trimestral') {
        return meta.ano_referencia === anoReferencia;
      }
      return false;
    });
    
    // Calculate progress for each meta
    const progresso = metasFiltradas.map(meta => {
      // Sum expenses for this category
      const gastosPorCategoria = filteredTransactions
        .filter(t => 
          t.operação?.toLowerCase() === 'saída' && 
          t.categoria === meta.categoria
        )
        .reduce((total, t) => total + (t.valor || 0), 0);
      
      // Calculate percentage of goal reached
      const porcentagem = meta.valor_meta > 0 ? gastosPorCategoria / meta.valor_meta : 0;
      
      // Determine status based on percentage thresholds - ensure precise comparison
      let status: 'baixo' | 'médio' | 'alto' | 'excedido' = 'baixo';
      
      // Melhorei a precisão da comparação para evitar problemas de arredondamento
      if (porcentagem >= LIMITE_ALTO) {
        status = 'excedido';
      } else if (porcentagem >= LIMITE_MEDIO) {
        status = 'alto';
      } else if (porcentagem >= LIMITE_BAIXO) {
        status = 'médio';
      }
      
      console.log(`Meta ${meta.categoria}: ${gastosPorCategoria}/${meta.valor_meta} = ${porcentagem * 100}% (status: ${status})`);
      
      return {
        meta,
        valor_atual: gastosPorCategoria,
        porcentagem,
        status
      };
    });
    
    setMetasProgresso(progresso);
  }, [metas, transactions, dateRange]);
  
  return metasProgresso;
};
