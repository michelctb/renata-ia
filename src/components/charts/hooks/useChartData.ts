
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Sao_Paulo';

export function useFilteredTransactions(
  transactions: Transaction[], 
  dateRange?: DateRange | null
) {
  return useMemo(() => {
    // Verificar se o dateRange existe e tem datas válidas
    if (!dateRange || !dateRange.from || isNaN(dateRange.from.getTime())) {
      return transactions;
    }
    
    // Validar também a data final do intervalo se existir
    if (dateRange.to && isNaN(dateRange.to.getTime())) {
      return transactions;
    }
    
    try {
      console.log(`Filtering chart data with date range: ${dateRange.from.toISOString()} to ${dateRange.to?.toISOString() || 'none'}`);
    } catch (error) {
      console.error('Error logging date range:', error);
    }
    
    return transactions.filter(transaction => {
      try {
        // Garantir que a string da data está em formato ISO
        const transactionDateStr = transaction.data;
        if (!transactionDateStr) return false;
        
        // Converter para o fuso horário de São Paulo
        try {
          const transactionDateUTC = parseISO(transactionDateStr);
          
          // Verificar se o parsing da data foi bem sucedido
          if (isNaN(transactionDateUTC.getTime())) {
            return false;
          }
          
          const transactionDate = toZonedTime(transactionDateUTC, TIMEZONE);
          
          // Normalizar para o início do dia
          const transactionDateStart = startOfDay(transactionDate);
          
          // Ajustar as datas do intervalo para o fuso horário de São Paulo
          const fromDate = dateRange.from ? startOfDay(toZonedTime(dateRange.from, TIMEZONE)) : null;
          const toDate = dateRange.to ? endOfDay(toZonedTime(dateRange.to, TIMEZONE)) : null;
          
          if (fromDate && toDate) {
            return isWithinInterval(transactionDateStart, { 
              start: fromDate, 
              end: toDate 
            });
          }
          
          if (fromDate) {
            return transactionDateStart >= fromDate;
          }
          
          return true;
        } catch (error) {
          console.error('Erro ao processar data para filtro:', transactionDateStr, error);
          return false;
        }
      } catch (error) {
        console.error('Erro ao analisar data para filtro de gráfico:', transaction.data, error);
        return false;
      }
    });
  }, [transactions, dateRange]);
}

export function useMonthlyChartData(filteredTransactions: Transaction[]) {
  return useMemo(() => {
    console.log('useMonthlyChartData - Iniciando processamento de', filteredTransactions.length, 'transações');
    
    const months = new Map();
    
    if (!filteredTransactions || filteredTransactions.length === 0) {
      console.log('useMonthlyChartData - Nenhuma transação para processar');
      return [];
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    filteredTransactions.forEach((transaction, index) => {
      try {
        if (!transaction.data) {
          console.warn(`useMonthlyChartData - Transação #${index} sem data:`, transaction);
          errorCount++;
          return;
        }
        
        // Parse the date and convert to São Paulo timezone
        const dateStr = transaction.data;
        
        // Log detalhado apenas para algumas transações para não sobrecarregar o console
        const shouldLog = index < 5 || index % 20 === 0;
        if (shouldLog) {
          console.log(`useMonthlyChartData - Processando transação #${index}, data: ${dateStr}`);
        }
        
        try {
          const dateUTC = parseISO(dateStr);
          
          // Verificar se a data foi parseada corretamente
          if (isNaN(dateUTC.getTime())) {
            console.warn(`useMonthlyChartData - Data inválida na transação #${index}:`, dateStr);
            errorCount++;
            return;
          }
          
          // Usar toZonedTime com tratamento de erro
          const date = toZonedTime(dateUTC, TIMEZONE);
          
          const monthKey = format(date, 'yyyy-MM');
          const monthLabel = format(date, 'MMM yyyy', { locale: ptBR });
          const operationType = transaction.operação?.toLowerCase() || '';
          
          if (shouldLog) {
            console.log(`useMonthlyChartData - Data processada para transação #${index}: ${monthKey} (${monthLabel}), operação: ${operationType}`);
          }
          
          if (!months.has(monthKey)) {
            months.set(monthKey, { 
              name: monthLabel, 
              entrada: 0, 
              saída: 0 
            });
          }
          
          const monthData = months.get(monthKey);
          const valor = Number(transaction.valor || 0);
          
          if (isNaN(valor)) {
            console.warn(`useMonthlyChartData - Valor inválido na transação #${index}:`, transaction.valor);
            errorCount++;
            return;
          }
          
          if (operationType === 'entrada') {
            monthData.entrada += valor;
          } else if (operationType === 'saída' || operationType === 'saida') {
            monthData.saída += valor;
          }
          
          successCount++;
        } catch (dateError) {
          console.error(`useMonthlyChartData - Erro processando data da transação #${index}:`, dateStr, dateError);
          errorCount++;
          return;
        }
      } catch (error) {
        console.error(`useMonthlyChartData - Erro geral processando transação #${index}:`, error);
        errorCount++;
      }
    });
    
    console.log(`useMonthlyChartData - Resultados: ${successCount} processadas com sucesso, ${errorCount} com erro`);
    
    const result = Array.from(months.values())
      .sort((a, b) => {
        // Corrigir o erro de tipo Month ordenando corretamente os meses
        const getMonthYear = (monthName: string) => {
          const parts = monthName.split(' ');
          if (parts.length !== 2) return { month: 0, year: 0 };
          
          const monthMap: Record<string, number> = {
            'jan': 1, 'fev': 2, 'mar': 3, 'abr': 4, 'mai': 5, 'jun': 6,
            'jul': 7, 'ago': 8, 'set': 9, 'out': 10, 'nov': 11, 'dez': 12
          };
          
          const monthIdx = monthMap[parts[0].toLowerCase()] || 0;
          const year = parseInt(parts[1]) || 0;
          
          return { month: monthIdx, year };
        };
        
        const dateA = getMonthYear(a.name);
        const dateB = getMonthYear(b.name);
        
        if (dateA.year !== dateB.year) {
          return dateA.year - dateB.year;
        }
        
        return dateA.month - dateB.month;
      });
    
    console.log('useMonthlyChartData - Dados finais:', result);
    return result;
  }, [filteredTransactions]);
}

export function useCategoryChartData(
  filteredTransactions: Transaction[], 
  transactionType: 'saída' | 'entrada'
) {
  return useMemo(() => {
    const categories = new Map();
    
    // Process transactions based on selected transaction type with case-insensitive check
    filteredTransactions
      .filter(t => {
        const opType = t.operação?.toLowerCase() || '';
        return opType === transactionType || opType === transactionType.replace('í', 'i');
      })
      .forEach(transaction => {
        // Handle empty or undefined category
        const category = transaction.categoria?.trim() || 'Sem categoria';
        
        if (!categories.has(category)) {
          categories.set(category, { 
            name: category, 
            value: 0 
          });
        }
        
        const categoryData = categories.get(category);
        categoryData.value += Number(transaction.valor || 0);
      });
    
    // Convert the Map to Array and sort by value (highest first)
    return Array.from(categories.values())
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions, transactionType]);
}
