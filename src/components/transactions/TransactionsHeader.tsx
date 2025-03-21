
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { DateRange } from "react-day-picker";
import DateRangePicker from "@/components/DateRangePicker";

interface TransactionsHeaderProps {
  onSearch: (value: string) => void;
  searchTerm: string;
  dateRange: DateRange | undefined;
  onDateRangeChange: (value: DateRange | undefined) => void;
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
  const isReadOnly = viewMode === 'consultor';
  
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="search"
          placeholder="Buscar transações..."
          className="w-full"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />
        
        {!isReadOnly && (
          <Button 
            onClick={onAddNew} 
            disabled={!isUserActive}
            className="whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        )}
      </div>
    </div>
  );
}
