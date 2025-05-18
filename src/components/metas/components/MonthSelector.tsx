
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addMonths, subMonths } from 'date-fns';
import { pt } from 'date-fns/locale';

interface MonthSelectorProps {
  currentDate: Date;
  onMonthChange: (newDate: Date) => void;
}

export function MonthSelector({ currentDate, onMonthChange }: MonthSelectorProps) {
  const handlePreviousMonth = () => {
    onMonthChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentDate, 1));
  };

  return (
    <div className="flex items-center justify-center gap-4 mb-4">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handlePreviousMonth}
        aria-label="Mês anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="text-lg font-medium">
        {format(currentDate, 'MMMM/yyyy', { locale: pt })}
      </div>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleNextMonth}
        aria-label="Próximo mês"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
