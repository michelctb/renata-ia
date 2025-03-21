
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface DateRangePickerProps {
  dateRange: DateRange | null;
  onDateRangeChange: (range: DateRange | null) => void;
}

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Seleciona o mês atual por padrão quando o componente é montado
  React.useEffect(() => {
    if (!dateRange) {
      handleSelectPeriod("thisMonth");
    }
  }, []);

  // Funções para períodos predefinidos
  const handleSelectPeriod = (value: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Define para o início do dia
    
    switch (value) {
      case "today": {
        // Hoje (início e fim do dia atual)
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        
        onDateRangeChange({
          from: today,
          to: endOfDay
        });
        break;
      }
      case "thisWeek": {
        // Esta semana (início da semana atual até hoje)
        const weekStart = startOfWeek(today, { locale: ptBR });
        const weekEnd = endOfWeek(today, { locale: ptBR });
        weekEnd.setHours(23, 59, 59, 999);
        
        onDateRangeChange({
          from: weekStart,
          to: weekEnd
        });
        break;
      }
      case "thisMonth": {
        // Mês atual (do primeiro ao último dia do mês)
        const firstDayOfMonth = startOfMonth(today);
        firstDayOfMonth.setHours(0, 0, 0, 0);
        
        const lastDayOfMonth = endOfMonth(today);
        lastDayOfMonth.setHours(23, 59, 59, 999);
        
        onDateRangeChange({
          from: firstDayOfMonth,
          to: lastDayOfMonth,
        });
        break;
      }
      case "lastMonth": {
        // Mês anterior
        const lastMonth = subMonths(today, 1);
        const firstDayOfLastMonth = startOfMonth(lastMonth);
        firstDayOfLastMonth.setHours(0, 0, 0, 0);
        
        const lastDayOfLastMonth = endOfMonth(lastMonth);
        lastDayOfLastMonth.setHours(23, 59, 59, 999);
        
        onDateRangeChange({
          from: firstDayOfLastMonth,
          to: lastDayOfLastMonth,
        });
        break;
      }
      case "clear":
        onDateRangeChange(null);
        break;
    }
  };

  // Determina qual período está selecionado
  const getSelectedPeriod = (): string => {
    if (!dateRange?.from || !dateRange?.to) return "";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);
    
    // Verificação para hoje
    if (
      dateRange.from.getDate() === today.getDate() &&
      dateRange.from.getMonth() === today.getMonth() &&
      dateRange.from.getFullYear() === today.getFullYear() &&
      dateRange.to.getDate() === today.getDate() &&
      dateRange.to.getMonth() === today.getMonth() &&
      dateRange.to.getFullYear() === today.getFullYear()
    ) {
      return "today";
    }
    
    // Verificação para esta semana
    const weekStart = startOfWeek(today, { locale: ptBR });
    const weekEnd = endOfWeek(today, { locale: ptBR });
    weekEnd.setHours(23, 59, 59, 999);
    
    if (
      dateRange.from.getTime() === weekStart.getTime() &&
      dateRange.to.getTime() === weekEnd.getTime()
    ) {
      return "thisWeek";
    }
    
    // Verificação para mês atual
    const firstDayOfMonth = startOfMonth(today);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    
    const lastDayOfMonth = endOfMonth(today);
    lastDayOfMonth.setHours(23, 59, 59, 999);
    
    if (
      dateRange.from.getTime() === firstDayOfMonth.getTime() &&
      dateRange.to.getTime() === lastDayOfMonth.getTime()
    ) {
      return "thisMonth";
    }
    
    // Verificação para mês anterior
    const lastMonth = subMonths(today, 1);
    const firstDayOfLastMonth = startOfMonth(lastMonth);
    firstDayOfLastMonth.setHours(0, 0, 0, 0);
    
    const lastDayOfLastMonth = endOfMonth(lastMonth);
    lastDayOfLastMonth.setHours(23, 59, 59, 999);
    
    if (
      dateRange.from.getTime() === firstDayOfLastMonth.getTime() &&
      dateRange.to.getTime() === lastDayOfLastMonth.getTime()
    ) {
      return "lastMonth";
    }
    
    return "";
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <ToggleGroup type="single" value={getSelectedPeriod()} onValueChange={handleSelectPeriod} className="flex flex-wrap bg-background dark:bg-gray-800 p-1 rounded-md border dark:border-gray-700">
        <ToggleGroupItem value="today" className="text-xs px-2 py-1 h-auto">
          Hoje
        </ToggleGroupItem>
        <ToggleGroupItem value="thisWeek" className="text-xs px-2 py-1 h-auto">
          Esta semana
        </ToggleGroupItem>
        <ToggleGroupItem value="thisMonth" className="text-xs px-2 py-1 h-auto">
          Mês atual
        </ToggleGroupItem>
        <ToggleGroupItem value="lastMonth" className="text-xs px-2 py-1 h-auto">
          Mês anterior
        </ToggleGroupItem>
      </ToggleGroup>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full sm:w-[230px] justify-start text-left font-normal",
              !dateRange?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                  {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                </>
              ) : (
                format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange || undefined}
            onSelect={(range) => {
              // Se selecionando um intervalo de um único dia, defina o final para o fim do dia
              if (range?.from && range?.to && range.from.getTime() === range.to.getTime()) {
                // Seleção de dia único - definir from para início do dia e to para fim do dia
                const from = new Date(range.from);
                from.setHours(0, 0, 0, 0);
                
                const to = new Date(range.to);
                to.setHours(23, 59, 59, 999);
                
                onDateRangeChange({ from, to });
              } else if (range?.from && range?.to) {
                // Seleção de vários dias - definir primeiro dia para início do dia e último dia para fim do dia
                const from = new Date(range.from);
                from.setHours(0, 0, 0, 0);
                
                const to = new Date(range.to);
                to.setHours(23, 59, 59, 999);
                
                onDateRangeChange({ from, to });
              } else {
                onDateRangeChange(range);
              }
              
              if (range?.from && range?.to) {
                setIsOpen(false);
              }
            }}
            numberOfMonths={2}
            locale={ptBR}
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
