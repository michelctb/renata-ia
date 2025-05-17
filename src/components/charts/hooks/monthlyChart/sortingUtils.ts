
import { MonthlyChartDataPoint } from './types';

/**
 * Extrai mês e ano do nome do mês formatado
 */
function getMonthYear(monthName: string): { month: number; year: number } {
  const parts = monthName.split(' ');
  if (parts.length !== 2) return { month: 0, year: 0 };
  
  const monthMap: Record<string, number> = {
    'jan': 1, 'fev': 2, 'mar': 3, 'abr': 4, 'mai': 5, 'jun': 6,
    'jul': 7, 'ago': 8, 'set': 9, 'out': 10, 'nov': 11, 'dez': 12
  };
  
  const monthIdx = monthMap[parts[0].toLowerCase()] || 0;
  const year = parseInt(parts[1]) || 0;
  
  return { month: monthIdx, year };
}

/**
 * Ordena os dados mensais cronologicamente
 */
export function sortMonthlyData(data: MonthlyChartDataPoint[]): MonthlyChartDataPoint[] {
  try {
    return [...data].sort((a, b) => {
      const dateA = getMonthYear(a.name);
      const dateB = getMonthYear(b.name);
      
      if (dateA.year !== dateB.year) {
        return dateA.year - dateB.year;
      }
      
      return dateA.month - dateB.month;
    });
  } catch (sortError) {
    console.error('Erro ao ordenar dados:', sortError);
    return data;
  }
}

/**
 * Gera um ponto de dados padrão para o mês atual
 */
export function generateDefaultDataPoint(): MonthlyChartDataPoint {
  // Importar format e locale aqui produziria uma dependência circular
  // Portanto, usamos uma string fixa para o mês atual
  const currentMonth = new Date().toLocaleString('pt-BR', { month: 'short' });
  const currentYear = new Date().getFullYear();
  
  return {
    name: `${currentMonth} ${currentYear}`,
    entrada: 0,
    saída: 0
  };
}
