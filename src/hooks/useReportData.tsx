import { useState, useEffect } from 'react';
import { fetchTransactions } from '@/lib/supabase/transactions';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval, subMonths, parseISO, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

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

export interface ReportData {
  transactions: any[];
  monthlyData: any[];
  categoryData: any[];
  metasComProgresso: any[];
  isLoading: boolean;
}

export function useReportData(selectedClient: string | null, dateRange: DateRange) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [metasComProgresso, setMetasComProgresso] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar dados de transações quando o cliente selecionado mudar
  useEffect(() => {
    const loadClientTransactions = async () => {
      if (!selectedClient) {
        setTransactions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const data = await fetchTransactions(selectedClient);
        
        // Normalizar os tipos de operações antes de processar
        const normalizedData = data.map(transaction => ({
          ...transaction,
          operação: normalizeOperationType(transaction.operação || '')
        }));
        
        setTransactions(normalizedData);
        processTransactionData(normalizedData);
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
        toast.error("Não foi possível carregar as transações");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadClientTransactions();
  }, [selectedClient]);

  // Processar dados de transações para os relatórios
  const processTransactionData = (data: any[]) => {
    if (!data.length) return;
    
    // Filtrar por data range
    const filteredData = data.filter(transaction => {
      try {
        const transactionDateStr = transaction.data;
        const transactionDate = startOfDay(parseISO(transactionDateStr));
        
        // Normalizar as datas do intervalo para garantir consistência
        const fromDate = dateRange.from ? startOfDay(dateRange.from) : null;
        const toDate = dateRange.to ? endOfDay(dateRange.to) : null;
        
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
        console.error('Erro ao processar data para relatório:', transaction.data, error);
        return false;
      }
    });

    // Processar dados mensais (receitas e despesas por mês)
    const monthlyDataMap = new Map();
    
    filteredData.forEach(item => {
      try {
        const date = parseISO(item.data);
        const monthYear = format(date, 'MMM/yyyy', { locale: ptBR });
        
        if (!monthlyDataMap.has(monthYear)) {
          monthlyDataMap.set(monthYear, { month: monthYear, receitas: 0, despesas: 0 });
        }
        
        const monthData = monthlyDataMap.get(monthYear);
        if (item.operação === 'entrada') {
          monthData.receitas += Number(item.valor || 0);
        } else if (item.operação === 'saída') {
          monthData.despesas += Number(item.valor || 0);
        }
      } catch (error) {
        console.error('Erro ao processar dados mensais:', item, error);
      }
    });
    
    const processedMonthlyData = Array.from(monthlyDataMap.values())
      .sort((a, b) => {
        const monthA = a.month.split('/')[0];
        const yearA = a.month.split('/')[1];
        const monthB = b.month.split('/')[0];
        const yearB = b.month.split('/')[1];
        
        const dateA = new Date(`${yearA}-${getMonthNumberFromName(monthA)}-01`);
        const dateB = new Date(`${yearB}-${getMonthNumberFromName(monthB)}-01`);
        
        return dateA.getTime() - dateB.getTime();
      });
    
    setMonthlyData(processedMonthlyData);
    
    // Processar dados por categoria
    const categoryDataMap = new Map();
    
    filteredData.forEach(item => {
      if (item.operação === 'saída' && item.categoria) {
        if (!categoryDataMap.has(item.categoria)) {
          categoryDataMap.set(item.categoria, 0);
        }
        categoryDataMap.set(item.categoria, categoryDataMap.get(item.categoria) + Number(item.valor || 0));
      }
    });
    
    const processedCategoryData = Array.from(categoryDataMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    setCategoryData(processedCategoryData);
    
    // Dados simulados para metas (em um sistema real, buscaríamos do banco)
    setMetasComProgresso([
      { 
        meta: { categoria: 'Alimentação', valor_meta: 1000 },
        valor_atual: 500,
        porcentagem: 0.5,
        status: 'em_andamento'
      },
      { 
        meta: { categoria: 'Transporte', valor_meta: 500 },
        valor_atual: 450,
        porcentagem: 0.9,
        status: 'em_andamento'
      }
    ]);
  };

  // Atualizar processamento quando mudar o date range
  useEffect(() => {
    if (transactions.length > 0) {
      processTransactionData(transactions);
    }
  }, [dateRange]);

  return {
    transactions,
    monthlyData,
    categoryData,
    metasComProgresso,
    isLoading
  };
}
