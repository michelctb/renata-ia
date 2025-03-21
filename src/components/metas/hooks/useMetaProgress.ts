
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
    
    const progresso = metasFiltradas.map(meta => {
      const gastosPorCategoria = filteredTransactions
        .filter(t => 
          t.operação?.toLowerCase() === 'saída' && 
          t.categoria === meta.categoria
        )
        .reduce((total, t) => total + (t.valor || 0), 0);
      
      const porcentagem = meta.valor_meta > 0 ? gastosPorCategoria / meta.valor_meta : 0;
      
      let status: 'baixo' | 'médio' | 'alto' | 'excedido' = 'baixo';
      if (porcentagem > LIMITE_ALTO) {
        status = 'excedido';
      } else if (porcentagem > LIMITE_MEDIO) {
        status = 'alto';
      } else if (porcentagem > LIMITE_BAIXO) {
        status = 'médio';
      }
      
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
