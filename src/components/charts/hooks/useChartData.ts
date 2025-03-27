
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase';
import { DateRange } from 'react-day-picker';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Sao_Paulo';

export function useFilteredTransactions(
  transactions: Transaction[], 
  dateRange?: DateRange | null
) {
  return useMemo(() => {
    if (!dateRange || !dateRange.from) return transactions;
    
    console.log(`Filtering chart data with date range: ${dateRange.from.toISOString()} to ${dateRange.to?.toISOString() || 'none'}`);
    
    return transactions.filter(transaction => {
      try {
        // Garantir que a string da data está em formato ISO
        const transactionDateStr = transaction.data;
        
        // Converter para o fuso horário de São Paulo
        const transactionDateUTC = parseISO(transactionDateStr);
        const transactionDateSaoPaulo = utcToZonedTime(transactionDateUTC, TIMEZONE);
        
        // Normalizar para o início do dia
        const transactionDate = startOfDay(transactionDateSaoPaulo);
        
        // Ajustar as datas do intervalo para o fuso horário de São Paulo
        const fromDate = dateRange.from ? startOfDay(utcToZonedTime(dateRange.from, TIMEZONE)) : null;
        const toDate = dateRange.to ? endOfDay(utcToZonedTime(dateRange.to, TIMEZONE)) : null;
        
        if (fromDate && toDate) {
          return isWithinInterval(transactionDate, { 
            start: fromDate, 
            end: toDate 
          });
        }
        
        if (fromDate) {
          return transactionDate >= fromDate;
        }
        
        return true;
      } catch (error) {
        console.error('Error parsing date for charts:', transaction.data, error);
        return false;
      }
    });
  }, [transactions, dateRange]);
}

export function useMonthlyChartData(filteredTransactions: Transaction[]) {
  return useMemo(() => {
    const months = new Map();
    
    filteredTransactions.forEach(transaction => {
      try {
        // Parse the date and convert to São Paulo timezone
        const dateStr = transaction.data;
        const date = utcToZonedTime(parseISO(dateStr), TIMEZONE);
        
        const monthKey = format(date, 'yyyy-MM');
        const monthLabel = format(date, 'MMM yyyy', { locale: ptBR });
        const operationType = transaction.operação?.toLowerCase() || '';
        
        if (!months.has(monthKey)) {
          months.set(monthKey, { 
            name: monthLabel, 
            entrada: 0, 
            saída: 0 
          });
        }
        
        const monthData = months.get(monthKey);
        
        if (operationType === 'entrada') {
          monthData.entrada += Number(transaction.valor);
        } else if (operationType === 'saída' || operationType === 'saida') {
          monthData.saída += Number(transaction.valor);
        }
      } catch (error) {
        console.error('Error processing date for monthly chart:', transaction.data, error);
      }
    });
    
    return Array.from(months.values())
      .sort((a, b) => {
        // Fix the Month type error by correctly parsing the month names to dates
        const getMonthNumber = (monthName: string) => {
          const months = {
            'jan': 0, 'fev': 1, 'mar': 2, 'abr': 3, 'mai': 4, 'jun': 5,
            'jul': 6, 'ago': 7, 'set': 8, 'out': 9, 'nov': 10, 'dez': 11
          };
          return months[monthName.toLowerCase().substring(0, 3)] || 0;
        };
        
        const [monthA, yearA] = a.name.split(' ');
        const [monthB, yearB] = b.name.split(' ');
        
        const yearDiff = parseInt(yearA) - parseInt(yearB);
        if (yearDiff !== 0) return yearDiff;
        
        return getMonthNumber(monthA) - getMonthNumber(monthB);
      });
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
