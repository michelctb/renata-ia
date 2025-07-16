import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthlyData {
  month: string;
  entradas: number;
  saidas: number;
}

export function useMonthlyChartData(transactions: Transaction[], dateRange?: DateRange | null) {
  return useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Agrupar transações por mês
    const monthlyGroups: { [key: string]: { entradas: number; saidas: number } } = {};

    transactions.forEach((transaction) => {
      if (!transaction.data || !transaction.valor || !transaction.operação) return;

      try {
        const date = parseISO(transaction.data);
        const monthKey = format(date, 'MMM yyyy', { locale: ptBR });
        
        if (!monthlyGroups[monthKey]) {
          monthlyGroups[monthKey] = { entradas: 0, saidas: 0 };
        }

        const valor = Math.abs(Number(transaction.valor));
        
        if (transaction.operação.toLowerCase() === 'entrada') {
          monthlyGroups[monthKey].entradas += valor;
        } else if (transaction.operação.toLowerCase() === 'saída') {
          monthlyGroups[monthKey].saidas += valor;
        }
      } catch (error) {
        console.warn('Erro ao processar data da transação:', transaction.data);
      }
    });

    // Converter para array e ordenar por data
    const monthlyData: MonthlyData[] = Object.entries(monthlyGroups)
      .map(([month, data]) => ({
        month,
        entradas: data.entradas,
        saidas: data.saidas,
      }))
      .sort((a, b) => {
        // Ordenar por data (mais antigo primeiro)
        try {
          // Extrair mês e ano do formato "jan 2024"
          const [monthA, yearA] = a.month.split(' ');
          const [monthB, yearB] = b.month.split(' ');
          
          // Converter mês abreviado para número
          const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 
                             'jul', 'ago', 'set', 'out', 'nov', 'dez'];
          const monthNumA = monthNames.indexOf(monthA.toLowerCase());
          const monthNumB = monthNames.indexOf(monthB.toLowerCase());
          
          // Primeiro comparar por ano, depois por mês
          const yearComparison = parseInt(yearA) - parseInt(yearB);
          if (yearComparison !== 0) return yearComparison;
          
          return monthNumA - monthNumB;
        } catch {
          return a.month.localeCompare(b.month);
        }
      });

    return monthlyData;
  }, [transactions, dateRange]);
}