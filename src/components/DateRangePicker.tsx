import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
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
          to: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999)
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
        // Definir primeiro dia do mês atual à 00:00:00
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        firstDay.setHours(0, 0, 0, 0);
        
        // Definir último dia do mês atual às 23:59:59
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        lastDay.setHours(23, 59, 59, 999);
        
        // Log para debug
        console.log('Filtro este mês:', 
          `De: ${firstDay.toISOString()} (${format(firstDay, 'dd/MM/yyyy HH:mm:ss')})`, 
          `Até: ${lastDay.toISOString()} (${format(lastDay, 'dd/MM/yyyy HH:mm:ss')})`
        );
        
        onDateRangeChange({
          from: firstDay,
          to: lastDay,
        });
        break;
      }
      case "lastMonth": {
        // Definir primeiro dia do mês anterior à 00:00:00
        const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        firstDay.setHours(0, 0, 0, 0);
        
        // Definir último dia do mês anterior às 23:59:59
        const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
        lastDay.setHours(23, 59, 59, 999);
        
        // Log para debug
        console.log('Filtro mês anterior:', 
          `De: ${firstDay.toISOString()} (${format(firstDay, 'dd/MM/yyyy HH:mm:ss')})`, 
          `Até: ${lastDay.toISOString()} (${format(lastDay, 'dd/MM/yyyy HH:mm:ss')})`
        );
        
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
