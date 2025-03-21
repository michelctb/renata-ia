
import { useState, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { startOfMonth, endOfMonth } from 'date-fns';

/**
 * Custom hook to manage period filtering and date range selection for financial data.
 * Provides functionality to switch between monthly and yearly periods and updates 
 * the date range accordingly.
 * 
 * @returns {Object} An object containing the selected period filter, date range, and helper functions
 * @property {string} periodoFiltro - Current period filter (e.g., 'mensal', 'anual')
 * @property {DateRange | null} dateRange - Selected date range with from and to dates
 * @property {Function} setDateRange - Function to manually set a date range
 * @property {Function} handleChangePeriodo - Function to change the period filter
 */
export const usePeriodoDateRange = () => {
  const [periodoFiltro, setPeriodoFiltro] = useState<string>('mensal');
  const [dateRange, setDateRange] = useState<DateRange | null>(() => {
    const hoje = new Date();
    const inicioMes = startOfMonth(hoje);
    const fimMes = endOfMonth(hoje);
    return { from: inicioMes, to: fimMes };
  });
  
  /**
   * Changes the current period filter and updates the date range accordingly.
   * 
   * @param {string} periodo - The new period filter ('mensal' or 'anual')
   */
  const handleChangePeriodo = useCallback((periodo: string) => {
    setPeriodoFiltro(periodo);
    
    const hoje = new Date();
    
    if (periodo === 'mensal') {
      const inicioMes = startOfMonth(hoje);
      const fimMes = endOfMonth(hoje);
      setDateRange({ from: inicioMes, to: fimMes });
    } else if (periodo === 'anual') {
      const inicioAno = new Date(hoje.getFullYear(), 0, 1);
      const fimAno = new Date(hoje.getFullYear(), 11, 31);
      setDateRange({ from: inicioAno, to: fimAno });
    }
  }, []);
  
  return {
    periodoFiltro,
    dateRange,
    setDateRange,
    handleChangePeriodo
  };
};
