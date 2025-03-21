
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { MetaCategoria } from '@/lib/metas';
import { DateRange } from 'react-day-picker';

export type MetaVsActualItem = {
  categoria: string;
  valorMeta: number;
  valorReal: number;
  diferenca: number;
  percentual: number;
};

export function useMetaVsActualData(
  metas: MetaCategoria[],
  transactions: Transaction[],
  dateRange: DateRange | null | undefined,
  transactionType: 'saída' | 'entrada' = 'saída'
) {
  return useMemo(() => {
    if (!metas.length || !transactions.length) {
      return {
        chartData: [],
        totalMeta: 0,
        totalReal: 0
      };
    }
    
    // Filtramos apenas as transações do tipo selecionado
    const filteredTransactions = transactions.filter(
      t => t.operação?.toLowerCase() === transactionType.toLowerCase()
    );
    
    // Mapeamos cada meta para incluir os valores reais correspondentes
    const metaVsActual: MetaVsActualItem[] = metas.map(meta => {
      // Somamos todas as transações da categoria
      const valorReal = filteredTransactions
        .filter(t => t.categoria === meta.categoria)
        .reduce((sum, t) => sum + (t.valor || 0), 0);
      
      // Calculamos a diferença e o percentual
      const diferenca = valorReal - meta.valor_meta;
      const percentual = meta.valor_meta > 0 ? (valorReal / meta.valor_meta) * 100 : 0;
      
      return {
        categoria: meta.categoria,
        valorMeta: meta.valor_meta,
        valorReal,
        diferenca,
        percentual
      };
    });
    
    // Ordenamos por percentual, do maior para o menor
    const sortedData = [...metaVsActual].sort((a, b) => b.percentual - a.percentual);
    
    // Calculamos os totais
    const totalMeta = sortedData.reduce((sum, item) => sum + item.valorMeta, 0);
    const totalReal = sortedData.reduce((sum, item) => sum + item.valorReal, 0);
    
    // Formatamos os dados para o gráfico
    const chartData = sortedData.map(item => ({
      name: item.categoria,
      meta: item.valorMeta,
      real: item.valorReal,
      percentual: Math.round(item.percentual)
    }));
    
    return {
      chartData,
      totalMeta,
      totalReal
    };
  }, [metas, transactions, transactionType]);
}
