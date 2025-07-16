
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
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
import { Input } from "@/components/ui/input";

export interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
}

export default function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
}: DateRangePickerProps) {
  // Referências para os popups de cada data
  const fromRef = React.useRef<HTMLButtonElement>(null);
  const toRef = React.useRef<HTMLButtonElement>(null);
  
  // Estados para controlar qual popover está aberto
  const [fromOpen, setFromOpen] = React.useState(false);
  const [toOpen, setToOpen] = React.useState(false);
  
  // Função de formatação segura que verifica se a data é válida antes de formatar
  const formatSafeDate = (date: Date | undefined): string => {
    if (!date || isNaN(date.getTime())) {
      return "";
    }
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };
  
  // Funções para lidar com a mudança de datas
  const handleFromDateSelect = (date: Date | undefined) => {
    const newRange: DateRange = {
      from: date,
      to: dateRange?.to
    };
    onDateRangeChange(newRange);
    setFromOpen(false);
    
    // Focar no campo "até" após selecionar a data inicial
    setTimeout(() => {
      if (!dateRange?.to) {
        setToOpen(true);
        toRef.current?.focus();
      }
    }, 100);
  };
  
  const handleToDateSelect = (date: Date | undefined) => {
    const newRange: DateRange = {
      from: dateRange?.from,
      to: date
    };
    onDateRangeChange(newRange);
    setToOpen(false);
  };
  
  // Limpar completamente o filtro de data
  const handleClearDates = () => {
    onDateRangeChange(undefined);
  };
  
  // Verificar se há algum filtro de data aplicado
  const hasDateFilter = !!(dateRange?.from || dateRange?.to);

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
        <div className="flex-1">
          <div className="text-xs text-muted-foreground mb-1">Data inicial:</div>
          <Popover open={fromOpen} onOpenChange={setFromOpen}>
            <PopoverTrigger asChild>
              <Button
                ref={fromRef}
                id="date-from"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal h-9",
                  !dateRange?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? formatSafeDate(dateRange.from) : "Selecione"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="single"
                selected={dateRange?.from}
                onSelect={handleFromDateSelect}
                locale={ptBR}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex-1">
          <div className="text-xs text-muted-foreground mb-1">Data final:</div>
          <Popover open={toOpen} onOpenChange={setToOpen}>
            <PopoverTrigger asChild>
              <Button
                ref={toRef}
                id="date-to"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal h-9",
                  !dateRange?.to && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.to ? formatSafeDate(dateRange.to) : "Selecione"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="single"
                selected={dateRange?.to}
                onSelect={handleToDateSelect}
                fromDate={dateRange?.from}
                locale={ptBR}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {hasDateFilter && (
          <div className="flex items-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearDates}
              className="mb-0.5 h-9"
            >
              Limpar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
