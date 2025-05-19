
import { format, parseISO, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import { DateRange } from 'react-day-picker';
import { getMonthNumberFromName } from '../reportDataUtils';

const TIMEZONE = 'America/Sao_Paulo';

// Verifica se uma data está dentro do intervalo de filtro
export const isDateInFilterRange = (
  date: string, 
  dateRange: DateRange | undefined | null
): boolean => {
  try {
    if (!dateRange || (!dateRange.from && !dateRange.to)) return true;
    
    const dateObj = parseISO(date);
    const dateSP = toZonedTime(dateObj, TIMEZONE);
    
    // Se tiver apenas data inicial
    if (dateRange.from && !dateRange.to) {
      return dateSP >= dateRange.from;
    }
    
    // Se tiver apenas data final
    if (!dateRange.from && dateRange.to) {
      return dateSP <= dateRange.to;
    }
    
    // Se tiver ambas as datas
    if (dateRange.from && dateRange.to) {
      return isWithinInterval(dateSP, {
        start: dateRange.from,
        end: dateRange.to
      });
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar se data está no intervalo:', error);
    return false;
  }
};

// Obter a chave de mês no formato "2023-05" a partir de uma data ISO
export const getMonthKeyFromDate = (date: string): string => {
  try {
    const dateObj = parseISO(date);
    const dateSP = toZonedTime(dateObj, TIMEZONE);
    return format(dateSP, 'yyyy-MM');
  } catch (error) {
    console.error('Erro ao extrair mês da data:', error);
    return '';
  }
};

// Formatar mês para exibição (ex: "maio/2023")
export const formatMonthForDisplay = (date: string): string => {
  try {
    const dateObj = parseISO(date);
    const dateSP = toZonedTime(dateObj, TIMEZONE);
    return format(dateSP, 'MMM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar mês para exibição:', error);
    return '';
  }
};

// Ordenar meses cronologicamente
export const sortMonthlyData = (monthKeys: string[]): string[] => {
  return [...monthKeys].sort((a, b) => {
    const [yearA, monthA] = a.split('-');
    const [yearB, monthB] = b.split('-');
    
    if (yearA !== yearB) {
      return Number(yearA) - Number(yearB);
    }
    
    return Number(monthA) - Number(monthB);
  });
};

// Converter nome do mês (maio/2023) para chave de mês (2023-05)
export const monthDisplayToKey = (monthDisplay: string): string => {
  try {
    const [month, year] = monthDisplay.split('/');
    const monthNumber = getMonthNumberFromName(month);
    return `${year}-${monthNumber}`;
  } catch (error) {
    console.error('Erro ao converter nome do mês para chave:', error);
    return '';
  }
};

// Converter chave de mês (2023-05) para nome do mês (maio/2023)
export const monthKeyToDisplay = (monthKey: string): string => {
  try {
    const [year, month] = monthKey.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return format(date, 'MMM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Erro ao converter chave para nome do mês:', error);
    return '';
  }
};
