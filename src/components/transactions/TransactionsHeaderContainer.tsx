
import { DateRange } from 'react-day-picker';
import { TransactionsHeader } from './TransactionsHeader';

interface TransactionsHeaderContainerProps {
  onSearch: (value: string) => void;
  searchTerm: string;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  onAddNew: () => void;
  isUserActive: boolean;
  viewMode: 'user' | 'admin' | 'consultor';
  selectedCategory?: string | null; // Adicionando selectedCategory
}

/**
 * Container component for the transactions header
 * Used across user, consultant, and client views
 */
export function TransactionsHeaderContainer({
  onSearch,
  searchTerm,
  dateRange,
  onDateRangeChange,
  onAddNew,
  isUserActive,
  viewMode,
  selectedCategory,
}: TransactionsHeaderContainerProps) {
  return (
    <TransactionsHeader
      onSearch={onSearch}
      searchTerm={searchTerm}
      onAddNew={onAddNew}
      isUserActive={isUserActive}
      viewMode={viewMode}
      selectedCategory={selectedCategory}
    />
  );
}
