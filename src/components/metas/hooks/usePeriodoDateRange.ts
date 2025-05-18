
import { useState, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { startOfMonth, endOfMonth } from 'date-fns';

/**
 * Custom hook para gerenciar a seleção de mês para as metas.
 * Fornece funcionalidades para navegar entre os meses e manter o intervalo de datas atualizado.
 */
export const usePeriodoDateRange = () => {
  // Inicializa com o mês atual
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | null>(() => {
    const inicioMes = startOfMonth(currentDate);
    const fimMes = endOfMonth(currentDate);
    return { from: inicioMes, to: fimMes };
  });
  
  /**
   * Atualiza a data atual e o intervalo de datas quando o mês é alterado
   */
  const changeMonth = useCallback((newDate: Date) => {
    setCurrentDate(newDate);
    const inicioMes = startOfMonth(newDate);
    const fimMes = endOfMonth(newDate);
    setDateRange({ from: inicioMes, to: fimMes });
  }, []);
  
  return {
    currentDate,
    dateRange,
    changeMonth
  };
};
