
import { DateRange } from 'react-day-picker';

export interface MonthlyDataItem {
  month: string;
  receitas: number;
  despesas: number;
}

export interface CategoryDataItem {
  name: string;
  value: number;
}

export interface MetaProgressItem {
  meta: {
    categoria: string;
    valor_meta: number;
  };
  valor_atual: number;
  porcentagem: number;
  status: string;
}

export interface ReportData {
  transactions: any[];
  monthlyData: MonthlyDataItem[];
  categoryData: CategoryDataItem[];
  metasComProgresso: MetaProgressItem[];
  isLoading: boolean;
}
