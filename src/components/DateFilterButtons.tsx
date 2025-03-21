
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import DateRangePicker from '@/components/DateRangePicker';
import { Plus } from 'lucide-react';

interface DateFilterButtonsProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onAddNew?: () => void;
  isUserActive?: boolean;
  viewMode?: 'user' | 'admin' | 'consultor';
}

export function DateFilterButtons({ 
  dateRange, 
  onDateRangeChange,
  onAddNew,
  isUserActive = true,
  viewMode = 'user'
}: DateFilterButtonsProps) {
  const isReadOnly = viewMode === 'consultor';
  
  const handleTodayClick = () => {
    const today = new Date();
    onDateRangeChange({
      from: startOfDay(today),
      to: endOfDay(today)
    });
  };

  const handleThisWeekClick = () => {
    const today = new Date();
    onDateRangeChange({
      from: startOfWeek(today, { locale: ptBR, weekStartsOn: 0 }),
      to: endOfWeek(today, { locale: ptBR, weekStartsOn: 0 })
    });
  };

  const handleThisMonthClick = () => {
    const today = new Date();
    onDateRangeChange({
      from: startOfMonth(today),
      to: endOfMonth(today)
    });
  };

  const handleLastMonthClick = () => {
    const today = new Date();
    const lastMonth = subMonths(today, 1);
    onDateRangeChange({
      from: startOfMonth(lastMonth),
      to: endOfMonth(lastMonth)
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 ml-auto">
      <div className="flex flex-wrap gap-1">
        <Button 
          variant="outline"
          size="sm"
          onClick={handleTodayClick}
          className="text-xs"
        >
          Hoje
        </Button>
        <Button 
          variant="outline"
          size="sm"
          onClick={handleThisWeekClick}
          className="text-xs"
        >
          Esta Semana
        </Button>
        <Button 
          variant="outline"
          size="sm"
          onClick={handleThisMonthClick}
          className="text-xs"
        >
          Mês Atual
        </Button>
        <Button 
          variant="outline"
          size="sm"
          onClick={handleLastMonthClick}
          className="text-xs"
        >
          Mês Passado
        </Button>
      </div>
      
      <DateRangePicker 
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
      />
      
      {onAddNew && !isReadOnly && (
        <Button 
          onClick={onAddNew} 
          disabled={!isUserActive}
          className="whitespace-nowrap ml-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      )}
    </div>
  );
}
