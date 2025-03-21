
import { useMemo } from 'react';
import { Transaction } from '@/lib/supabase/types';
import { DateRange } from 'react-day-picker';
import { isWithinInterval, parseISO } from 'date-fns';

/**
 * Hook to filter transactions by date range
 */
export function useFilteredTransactions(
  transactions: Transaction[],
  dateRange?: DateRange | null
) {
  return useMemo(() => {
    if (!dateRange?.from) {
      return transactions;
    }

    return transactions.filter(transaction => {
      try {
        const transactionDate = parseISO(transaction.data);
        
        // If only 'from' date is provided
        if (dateRange.from && !dateRange.to) {
          return transactionDate >= dateRange.from;
        }
        
        // If both 'from' and 'to' dates are provided
        if (dateRange.from && dateRange.to) {
          return isWithinInterval(transactionDate, {
            start: dateRange.from,
            end: dateRange.to
          });
        }
        
        return true;
      } catch (error) {
        console.error('Error filtering transaction by date:', error);
        return false;
      }
    });
  }, [transactions, dateRange]);
}

/**
 * Hook to prepare data for monthly chart
 */
export function useMonthlyChartData(transactions: Transaction[]) {
  return useMemo(() => {
    // Group transactions by month, calculate monthly income and expenses
    const monthlyData = transactions.reduce((acc, transaction) => {
      try {
        // Extract month and year from the transaction date
        const date = parseISO(transaction.data);
        const month = date.getMonth();
        const year = date.getFullYear();
        const monthKey = `${year}-${month + 1}`;
        
        // Initialize the month if it doesn't exist in the accumulator
        if (!acc[monthKey]) {
          acc[monthKey] = {
            month: month + 1,
            year,
            entrada: 0,
            saída: 0,
            name: new Date(year, month).toLocaleDateString('pt-BR', { month: 'short' })
          };
        }
        
        // Add to income or expenses based on transaction type
        const amount = transaction.valor;
        const operationType = (transaction.operação || '').toLowerCase();
        
        if (operationType === 'entrada') {
          acc[monthKey].entrada += amount;
        } else if (operationType === 'saída') {
          acc[monthKey].saída += amount;
        }
        
        return acc;
      } catch (error) {
        console.error('Error processing transaction for monthly chart:', error);
        return acc;
      }
    }, {} as Record<string, { month: number; year: number; entrada: number; saída: number; name: string }>);
    
    // Convert the object to an array sorted by year and month
    return Object.values(monthlyData).sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.month - b.month;
    });
  }, [transactions]);
}

/**
 * Hook to prepare data for category charts
 */
export function useCategoryChartData(
  transactions: Transaction[], 
  transactionType: 'entrada' | 'saída',
  goalsByCategory?: Record<string, number>
) {
  return useMemo(() => {
    // Filter transactions by type
    const filteredTransactions = transactions.filter(
      transaction => transaction.operação?.toLowerCase() === transactionType
    );
    
    // Group by category and sum values
    const categoryMap = filteredTransactions.reduce((acc, transaction) => {
      const category = transaction.categoria;
      
      if (!acc[category]) {
        acc[category] = 0;
      }
      
      acc[category] += transaction.valor;
      
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array format for charts
    const data = Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value,
        goalValue: goalsByCategory?.[name]
      }))
      .filter(item => item.value > 0);
    
    console.log(`Category data for ${transactionType}:`, data);
    
    return { data, goalValues: goalsByCategory };
  }, [transactions, transactionType, goalsByCategory]);
}
