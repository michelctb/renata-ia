
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangePickerProps {
  dateRange: DateRange | null;
  onDateRangeChange: (range: DateRange | null) => void;
}

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Predefined ranges
  const handleSelectPredefined = (value: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    
    switch (value) {
      case "today":
        onDateRangeChange({
          from: today,
          to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999) // End of day
        });
        break;
      case "yesterday": {
        const yesterday = addDays(today, -1);
        onDateRangeChange({
          from: yesterday,
          to: yesterday,
        });
        break;
      }
      case "7days": {
        onDateRangeChange({
          from: addDays(today, -6),
          to: today,
        });
        break;
      }
      case "30days": {
        onDateRangeChange({
          from: addDays(today, -29),
          to: today,
        });
        break;
      }
      case "thisMonth": {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        onDateRangeChange({
          from: firstDay,
          to: lastDay,
        });
        break;
      }
      case "lastMonth": {
        const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
        onDateRangeChange({
          from: firstDay,
          to: lastDay,
        });
        break;
      }
      case "clear":
        onDateRangeChange(null);
        break;
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Select onValueChange={handleSelectPredefined}>
        <SelectTrigger className="h-10 w-[180px]">
          <SelectValue placeholder="Selecionar período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Hoje</SelectItem>
          <SelectItem value="yesterday">Ontem</SelectItem>
          <SelectItem value="7days">Últimos 7 dias</SelectItem>
          <SelectItem value="30days">Últimos 30 dias</SelectItem>
          <SelectItem value="thisMonth">Este mês</SelectItem>
          <SelectItem value="lastMonth">Mês anterior</SelectItem>
          <SelectItem value="clear">Limpar filtro</SelectItem>
        </SelectContent>
      </Select>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
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
              // If selecting a day range, set the end time to end of day
              if (range?.from && range?.to && range.from.getTime() === range.to.getTime()) {
                // Single day selection - set from to start of day and to to end of day
                const from = new Date(range.from);
                from.setHours(0, 0, 0, 0);
                
                const to = new Date(range.to);
                to.setHours(23, 59, 59, 999);
                
                onDateRangeChange({ from, to });
              } else if (range?.from && range?.to) {
                // Multiple day selection - set first day to start of day and last day to end of day
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
