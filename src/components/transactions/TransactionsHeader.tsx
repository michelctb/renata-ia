
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { SearchInput } from './SearchInput';
import { DateRangePicker } from '@/components/DateRangePicker';
import { TransactionActions } from './TransactionActions';
import { usePeriodoDateRange } from '../metas/hooks/usePeriodoDateRange';

interface TransactionsHeaderProps {
  onSearch: (term: string) => void;
  searchTerm: string;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onAddNew: () => void;
  isUserActive: boolean;
  viewMode?: 'user' | 'admin' | 'consultor';
}

export function TransactionsHeader({
  onSearch,
  searchTerm,
  dateRange,
  onDateRangeChange,
  onAddNew,
  isUserActive,
  viewMode = 'user'
}: TransactionsHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0 mb-6">
      <div className="flex-1 flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <SearchInput 
          value={searchTerm} 
          onChange={(e) => onSearch(e.target.value)} 
          placeholder="Buscar transações..." 
          className="md:w-64" 
        />
        
        <DateRangePicker 
          dateRange={dateRange}
          onChange={onDateRangeChange}
        />
      </div>
      
      <TransactionActions 
        onAddNew={onAddNew} 
        isActive={isUserActive}
        viewMode={viewMode}
      />
    </div>
  );
}
