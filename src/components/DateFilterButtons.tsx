
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import DateRangePicker from '@/components/DateRangePicker';
import { Plus, CalendarRange } from 'lucide-react';

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
    const newRange = {
      from: startOfDay(today),
      to: endOfDay(today)
    };
    onDateRangeChange(newRange);
  };

  const handleThisWeekClick = () => {
    const today = new Date();
    const newRange = {
      from: startOfWeek(today, { locale: ptBR, weekStartsOn: 0 }),
      to: endOfWeek(today, { locale: ptBR, weekStartsOn: 0 })
    };
    onDateRangeChange(newRange);
  };

  const handleThisMonthClick = () => {
    const today = new Date();
    const newRange = {
      from: startOfMonth(today),
      to: endOfMonth(today)
    };
    onDateRangeChange(newRange);
  };

  const handleLastMonthClick = () => {
    const today = new Date();
    const lastMonth = subMonths(today, 1);
    const newRange = {
      from: startOfMonth(lastMonth),
      to: endOfMonth(lastMonth)
    };
    onDateRangeChange(newRange);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="flex-1">
          <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <CalendarRange className="h-3 w-3" /> 
            Período rápido:
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={handleTodayClick}
              className="text-xs px-3 py-1 h-8"
            >
              Hoje
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleThisWeekClick}
              className="text-xs px-3 py-1 h-8"
            >
              Esta Semana
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleThisMonthClick}
              className="text-xs px-3 py-1 h-8"
            >
              Mês Atual
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleLastMonthClick}
              className="text-xs px-3 py-1 h-8"
            >
              Mês Passado
            </Button>
          </div>
        </div>
        
        <div className="flex-1 lg:max-w-md">
          <DateRangePicker 
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
          />
        </div>
        
        {onAddNew && !isReadOnly && (
          <div className="flex items-end">
            <Button 
              onClick={onAddNew} 
              disabled={!isUserActive}
              className="whitespace-nowrap h-9"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Transação
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
