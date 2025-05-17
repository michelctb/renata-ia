
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
    // Log de debug para ajudar na identificação de problemas
    console.log('useFilteredTransactions - Início:', {
      transactionsCount: transactions?.length || 0,
      hasDateRange: !!dateRange,
      dateRange
    });
    
    // Se não houver dateRange, retorna todas as transações
    if (!dateRange) {
      return transactions;
    }
    
    // Verificar se o dateRange e sua propriedade from são válidos
    if (!dateRange.from || isNaN(dateRange.from.getTime())) {
      console.warn('useFilteredTransactions - dateRange.from inválido:', dateRange.from);
      return transactions;
    }
    
    try {
      // Na versão 3.x do date-fns-tz, toZonedTime é usado para converter entre fusos horários
      // Ajustando para garantir que estamos lidando corretamente com a data
      const fromDate = startOfDay(toZonedTime(dateRange.from, TIMEZONE));
      let toDate = dateRange.to 
        ? endOfDay(toZonedTime(dateRange.to, TIMEZONE)) 
        : endOfDay(toZonedTime(dateRange.from, TIMEZONE));
      
      // Logar o intervalo de datas filtrado
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
          if (!transactionDateStr) {
            console.warn('Transação sem data:', transaction);
            return false;
          }
          
          // Converter para o fuso horário de São Paulo com manejo de erros
          try {
            const transactionDateUTC = parseISO(transactionDateStr);
            
            // Verificar se a data foi parseada corretamente
            if (isNaN(transactionDateUTC.getTime())) {
              console.warn('Data inválida na transação:', transactionDateStr);
              return false;
            }
            
            const transactionDate = toZonedTime(transactionDateUTC, TIMEZONE);
            
            // Normalizar para o início do dia para a comparação
            const transactionDateStart = startOfDay(transactionDate);
            
            // Verificar se a data da transação está dentro do intervalo
            const isInRange = isWithinInterval(transactionDateStart, { 
              start: fromDate, 
              end: toDate 
            });
            
            if (isInRange) {
              transacoesFiltradas++;
            } else {
              transacoesForaIntervalo++;
            }
            
            return isInRange;
          } catch (parseError) {
            console.error('Erro no parsing da data:', transactionDateStr, parseError);
            return false;
          }
        } catch (error) {
          console.error('Erro ao analisar data da transação:', transaction.data, error);
          return false;
        }
      });
      
      console.log(`Resultado da filtragem: ${transacoesFiltradas} dentro do intervalo, ${transacoesForaIntervalo} fora.`);
      
      return filtered;
    } catch (error) {
      console.error('Erro ao filtrar transações por data:', error);
      return transactions;
    }
  }, [transactions, dateRange]);
}
