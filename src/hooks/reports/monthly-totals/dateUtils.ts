
import { parseISO, format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import { DateRange } from 'react-day-picker';

const TIMEZONE = 'America/Sao_Paulo';

// Obter chave padrão de mês/ano a partir de uma data
export const getMonthKeyFromDate = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    return format(date, 'yyyy-MM');
  } catch (error) {
    console.error('Erro ao gerar chave do mês:', error);
    return '';
  }
};

// Formatar mês para exibição (ex: "jan/2023")
export const formatMonthForDisplay = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    return format(date, 'MMM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar mês para exibição:', error);
    return '';
  }
};

// Verificar se uma data está dentro do intervalo de filtro
export const isDateInFilterRange = (dateStr: string, dateRange: DateRange | null | undefined): boolean => {
  try {
    if (!dateRange || !dateRange.from) return true;
    
    const date = parseISO(dateStr);
    const dateSP = toZonedTime(date, TIMEZONE);
    
    const fromDate = dateRange.from ? startOfDay(toZonedTime(dateRange.from, TIMEZONE)) : null;
    const toDate = dateRange.to ? endOfDay(toZonedTime(dateRange.to, TIMEZONE)) : fromDate;
    
    if (fromDate && toDate) {
      return isWithinInterval(dateSP, { start: fromDate, end: toDate });
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar se data está no intervalo:', error);
    return false;
  }
};

// Ordenar chaves de meses cronologicamente
export const sortMonthlyData = (monthKeys: string[]): string[] => {
  return [...monthKeys].sort((a, b) => {
    // Formato esperado: yyyy-MM
    return a.localeCompare(b);
  });
};

// Converter chave do mês (yyyy-MM) para formato de exibição (MMM/yyyy)
export const monthKeyToDisplay = (monthKey: string): string => {
  try {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return format(date, 'MMM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Erro ao converter chave do mês para exibição:', error);
    return monthKey;
  }
};
