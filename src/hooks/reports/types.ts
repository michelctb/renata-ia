
import { DateRange } from 'react-day-picker';

export interface MonthlyDataItem {
  month: string;
  monthKey: string;
  receitas: number;
  despesas: number;
  balance: number;
  isInDateRange: boolean;
}

export interface CategoryDataItem {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface MetaProgressItem {
  categoria: string;
  atual: number;
  meta: number;
  percentual: number;
}

export interface ReportData {
  transactions: any[];
  monthlyData: MonthlyDataItem[];
  categoryData: CategoryDataItem[];
  metasComProgresso: MetaProgressItem[];
  isLoading: boolean;
  comparisonData?: MonthlyDataItem[];
}
