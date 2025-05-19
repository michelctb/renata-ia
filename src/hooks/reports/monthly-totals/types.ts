
import { DateRange } from 'react-day-picker';

export interface MonthlyTotalItem {
  month: string;
  monthKey: string;
  receitas: number;
  despesas: number;
  balance: number;
  isInDateRange: boolean;
}

export interface UseMonthlyTotalsResult {
  monthlyTotals: MonthlyTotalItem[];
  isLoading: boolean;
  error: Error | null;
}
