
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
  // Função de formatação segura que verifica se a data é válida antes de formatar
  const formatSafeDate = (date: Date | undefined): string => {
    if (!date || isNaN(date.getTime())) {
      return "";
    }
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  // Obter o texto a ser exibido no botão com base no intervalo de datas
  const getButtonText = (): React.ReactNode => {
    if (!dateRange) {
      return <span>Selecione um período</span>;
    }
    
    if (dateRange.from) {
      if (dateRange.to) {
        const fromText = formatSafeDate(dateRange.from);
        const toText = formatSafeDate(dateRange.to);
        if (fromText && toText) {
          return (
            <>
              <span className="text-primary font-medium">De:</span> {fromText} <span className="text-primary font-medium mx-1">até:</span> {toText}
            </>
          );
        }
      } else {
        const fromText = formatSafeDate(dateRange.from);
        if (fromText) {
          return (
            <>
              <span className="text-primary font-medium">A partir de:</span> {fromText}
            </>
          );
        }
      }
    }
    
    return <span>Selecione um período</span>;
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getButtonText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-2 bg-muted/20 border-b text-center text-sm">
            <p>Clique para selecionar a <strong>data inicial</strong>, depois clique novamente para a <strong>data final</strong>.</p>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from && !isNaN(dateRange.from.getTime()) ? dateRange.from : undefined}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
            locale={ptBR}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

