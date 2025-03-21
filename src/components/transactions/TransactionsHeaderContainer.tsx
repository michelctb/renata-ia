
import { TransactionsHeader } from './TransactionsHeader';

interface TransactionsHeaderContainerProps {
  onSearch: (value: string) => void;
  searchTerm: string;
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
  onAddNew,
  isUserActive,
  viewMode,
}: TransactionsHeaderContainerProps) {
  return (
    <TransactionsHeader
      onSearch={onSearch}
      searchTerm={searchTerm}
      onAddNew={onAddNew}
      isUserActive={isUserActive}
      viewMode={viewMode}
    />
  );
}
