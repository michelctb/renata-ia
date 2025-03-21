
import { DateRange } from 'react-day-picker';
import { TransactionsHeader } from './TransactionsHeader';

interface TransactionsHeaderContainerProps {
  onSearch: (value: string) => void;
  searchTerm: string;
  dateRange: DateRange | undefined;
  onDateRangeChange: (value: DateRange | undefined) => void;
  onAddNew: () => void;
  isUserActive: boolean;
  viewMode: 'user' | 'admin' | 'consultor';
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
}: TransactionsHeaderContainerProps) {
  return (
    <TransactionsHeader
      onSearch={onSearch}
      searchTerm={searchTerm}
      dateRange={dateRange}
      onDateRangeChange={onDateRangeChange}
      onAddNew={onAddNew}
      isUserActive={isUserActive}
      viewMode={viewMode}
    />
  );
}
