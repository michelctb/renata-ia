
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
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <CalendarRange className="h-3 w-3" /> 
            Período rápido:
          </div>
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
        </div>
        
        <div>
          <DateRangePicker 
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
          />
        </div>
      </div>
      
      {onAddNew && !isReadOnly && (
        <div className="flex justify-end mt-2">
          <Button 
            onClick={onAddNew} 
            disabled={!isUserActive}
            className="whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        </div>
      )}
    </div>
  );
}
