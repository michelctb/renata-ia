
import { format, parseISO, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import { DateRange } from 'react-day-picker';
import { MonthlyDataItem, CategoryDataItem } from './types';

const TIMEZONE = 'America/Sao_Paulo';

// Função auxiliar para normalizar o tipo de operação
export const normalizeOperationType = (operation: string): 'entrada' | 'saída' => {
  const normalized = operation.toLowerCase().trim();
  
  // Verificar variações de "entrada"
  if (normalized === 'entrada' || normalized === 'receita') {
    return 'entrada';
  }
  
  // Verificar variações de "saída"
  if (normalized === 'saída' || normalized === 'saida' || normalized === 'despesa') {
    return 'saída';
  }
  
  // Valor padrão se não for reconhecido
  console.warn(`Tipo de operação não reconhecido: ${operation}, considerando como saída`);
  return 'saída';
};

// Função auxiliar para obter o número do mês a partir do nome abreviado
export const getMonthNumberFromName = (monthName: string): string => {
  const monthIndex = [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 
    'jul', 'ago', 'set', 'out', 'nov', 'dez'
  ].findIndex(m => monthName.toLowerCase().startsWith(m)) + 1;
  
  return monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`;
};

// Filtra transações por intervalo de datas
export const filterTransactionsByDateRange = (
  transactions: any[], 
  dateRange: DateRange
): any[] => {
  if (!transactions.length) return [];
  
  return transactions.filter(transaction => {
    try {
      // Converter para o fuso horário de São Paulo
      const transactionDateStr = transaction.data;
      const transactionDateUTC = parseISO(transactionDateStr);
      const transactionDateSaoPaulo = toZonedTime(transactionDateUTC, TIMEZONE);
      
      // Normalizar para o início do dia
      const transactionDate = startOfDay(transactionDateSaoPaulo);
      
      // Normalizar as datas do intervalo para o fuso horário de São Paulo
      const fromDate = dateRange.from ? startOfDay(toZonedTime(dateRange.from, TIMEZONE)) : null;
      const toDate = dateRange.to ? endOfDay(toZonedTime(dateRange.to, TIMEZONE)) : null;
      
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
      console.error('Erro ao processar data para filtro:', transaction.data, error);
      return false;
    }
  });
};

// Processa dados para gráfico mensal
export const processMonthlyData = (filteredData: any[]): MonthlyDataItem[] => {
  const monthlyDataMap = new Map<string, MonthlyDataItem>();
  
  filteredData.forEach(item => {
    try {
      // Converter para o fuso horário de São Paulo
      const dateUTC = parseISO(item.data);
      const dateSaoPaulo = toZonedTime(dateUTC, TIMEZONE);
      
      const monthYear = format(dateSaoPaulo, 'MMM/yyyy', { locale: ptBR });
      const monthKey = `${format(dateSaoPaulo, 'yyyy-MM')}`;
      
      if (!monthlyDataMap.has(monthYear)) {
        monthlyDataMap.set(monthYear, { 
          month: monthYear,
          monthKey,
          receitas: 0, 
          despesas: 0,
          balance: 0,
          isInDateRange: true 
        });
      }
      
      const monthData = monthlyDataMap.get(monthYear)!;
      if (item.operação === 'entrada') {
        monthData.receitas += Number(item.valor || 0);
      } else if (item.operação === 'saída') {
        monthData.despesas += Number(item.valor || 0);
      }
      
      monthData.balance = monthData.receitas - monthData.despesas;
    } catch (error) {
      console.error('Erro ao processar dados mensais:', item, error);
    }
  });
  
  return sortMonthlyData(Array.from(monthlyDataMap.values()));
};

// Ordena dados mensais cronologicamente
export const sortMonthlyData = (monthlyData: MonthlyDataItem[]): MonthlyDataItem[] => {
  return monthlyData.sort((a, b) => {
    const monthA = a.month.split('/')[0];
    const yearA = a.month.split('/')[1];
    const monthB = b.month.split('/')[0];
    const yearB = b.month.split('/')[1];
    
    const dateA = new Date(`${yearA}-${getMonthNumberFromName(monthA)}-01`);
    const dateB = new Date(`${yearB}-${getMonthNumberFromName(monthB)}-01`);
    
    return dateA.getTime() - dateB.getTime();
  });
};

// Processa dados por categoria
export const processCategoryData = (filteredData: any[]): CategoryDataItem[] => {
  const categoryMap = new Map<string, { total: number, count: number }>();
  
  filteredData.forEach(item => {
    if (item.operação === 'saída' && item.categoria) {
      if (!categoryMap.has(item.categoria)) {
        categoryMap.set(item.categoria, { total: 0, count: 0 });
      }
      const categoryData = categoryMap.get(item.categoria)!;
      categoryData.total += Number(item.valor || 0);
      categoryData.count += 1;
    }
  });
  
  const totalValue = Array.from(categoryMap.values()).reduce((sum, item) => sum + item.total, 0);
  
  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      amount: data.total,
      percentage: totalValue > 0 ? (data.total / totalValue * 100) : 0,
      count: data.count
    }))
    .sort((a, b) => b.amount - a.amount);
};

// Gera dados simulados para metas
export const generateSimulatedMetasData = (): any[] => {
  return [
    { 
      categoria: 'Alimentação', 
      atual: 500,
      meta: 1000,
      percentual: 0.5
    },
    { 
      categoria: 'Transporte',
      atual: 450,
      meta: 500,
      percentual: 0.9
    }
  ];
};
