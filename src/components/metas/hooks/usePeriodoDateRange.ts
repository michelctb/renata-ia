
import { useState, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { startOfMonth, endOfMonth } from 'date-fns';

export const usePeriodoDateRange = () => {
  const [periodoFiltro, setPeriodoFiltro] = useState<string>('mensal');
  const [dateRange, setDateRange] = useState<DateRange | null>(() => {
    const hoje = new Date();
    const inicioMes = startOfMonth(hoje);
    const fimMes = endOfMonth(hoje);
    return { from: inicioMes, to: fimMes };
  });
  
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
