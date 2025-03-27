
import { DateRange } from 'react-day-picker';

/**
 * Hook utilitário para validação de datas
 */
export function useDateValidation() {
  /**
   * Verifica se uma data é válida
   */
  const isValidDate = (date: Date | undefined): boolean => {
    return date !== undefined && date !== null && !isNaN(date.getTime());
  };

  /**
   * Verifica se um intervalo de datas é válido
   */
  const isValidDateRange = (range: DateRange | undefined | null): boolean => {
    if (!range) return false;
    
    const fromValid = isValidDate(range.from);
    
    // Se não tiver data final, basta a inicial ser válida
    if (!range.to) return fromValid;
    
    // Se tiver data final, ambas precisam ser válidas
    return fromValid && isValidDate(range.to);
  };

  /**
   * Retorna um intervalo de datas seguro (com validação)
   */
  const getSafeDateRange = (range: DateRange | undefined | null): DateRange | undefined => {
    if (!range) return undefined;
    
    const result: DateRange = {};
    
    if (isValidDate(range.from)) {
      result.from = range.from;
    }
    
    if (isValidDate(range.to)) {
      result.to = range.to;
    }
    
    // Se ao menos uma data for válida, retorna o intervalo
    if (result.from || result.to) {
      return result;
    }
    
    return undefined;
  };

  return {
    isValidDate,
    isValidDateRange,
    getSafeDateRange
  };
}
