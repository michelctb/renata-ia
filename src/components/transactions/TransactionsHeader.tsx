
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/DateRangePicker';

interface TransactionsHeaderProps {
  dateRange: DateRange | null;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | null>>;
  onAddNew: () => void;
}

export function TransactionsHeader({
  dateRange,
  setDateRange,
  onAddNew
}: TransactionsHeaderProps) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <DateRangePicker 
          dateRange={dateRange} 
          onDateRangeChange={setDateRange} 
        />
        
        <Button 
          onClick={onAddNew}
          className="whitespace-nowrap"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Nova Transação
        </Button>
      </div>
    </div>
  );
}
