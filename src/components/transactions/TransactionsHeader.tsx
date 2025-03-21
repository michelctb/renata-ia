
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import DateRangePicker from '@/components/DateRangePicker';

export interface TransactionsHeaderProps {
  dateRange: DateRange | null;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | null>>;
  onAddNew: () => void;
  isUserActive: boolean;
  viewMode?: 'user' | 'admin' | 'consultor';
}

export function TransactionsHeader({ 
  dateRange, 
  setDateRange, 
  onAddNew, 
  isUserActive,
  viewMode = 'user'
}: TransactionsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transações</h2>
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
        <DateRangePicker 
          dateRange={dateRange} 
          setDateRange={setDateRange} 
        />
        <Button 
          onClick={onAddNew} 
          disabled={!isUserActive || viewMode === 'consultor'}
          className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          {viewMode === 'consultor' ? 'Modo Visualização' : 'Nova Transação'}
        </Button>
      </div>
    </div>
  );
}
