
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Sao_Paulo';

export function useFilteredTransactions(
  transactions: Transaction[], 
  dateRange?: DateRange | null
) {
  return useMemo(() => {
    // Se não houver dateRange, retorna todas as transações
    if (!dateRange) {
      return transactions;
    }
    
    // Verificar se o dateRange e sua propriedade from são válidos
    if (!dateRange.from || isNaN(dateRange.from.getTime())) {
      return transactions;
    }
    
    const fromDate = startOfDay(toZonedTime(dateRange.from, TIMEZONE));
    let toDate = dateRange.to ? endOfDay(toZonedTime(dateRange.to, TIMEZONE)) : endOfDay(toZonedTime(dateRange.from, TIMEZONE));
    
    // Logar uma única vez o intervalo de datas filtrado
    console.log(`Filtrando transações com intervalo de datas:`, {
      de: fromDate.toISOString(),
      ate: toDate.toISOString()
    });
    
    let transacoesFiltradas = 0;
    let transacoesForaIntervalo = 0;
    
    const filtered = transactions.filter(transaction => {
      try {
        // Garantir que a string da data está em formato ISO
        const transactionDateStr = transaction.data;
        
        // Converter para o fuso horário de São Paulo
        const transactionDateUTC = parseISO(transactionDateStr);
        const transactionDateSaoPaulo = toZonedTime(transactionDateUTC, TIMEZONE);
        
        // Normalizar para o início do dia para a comparação
        const transactionDate = startOfDay(transactionDateSaoPaulo);
        
        // Verificar se a data da transação está dentro do intervalo
        const isInRange = isWithinInterval(transactionDate, { 
          start: fromDate, 
          end: toDate 
        });
        
        if (isInRange) {
          transacoesFiltradas++;
        } else {
          transacoesForaIntervalo++;
        }
        
        return isInRange;
      } catch (error) {
        console.error('Erro ao analisar data da transação:', transaction.data, error);
        return false;
      }
    });
    
    console.log(`Resultado da filtragem: ${transacoesFiltradas} dentro do intervalo, ${transacoesForaIntervalo} fora.`);
    
    return filtered;
  }, [transactions, dateRange]);
}
