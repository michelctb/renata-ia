
import { DateRange } from 'react-day-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/DateRangePicker';

interface MetasHeaderProps {
  periodoFiltro: string;
  dateRange: DateRange | null;
  onChangePeriodo: (value: string) => void;
  onDateRangeChange: (range: DateRange | null) => void;
}

export function MetasHeader({ 
  periodoFiltro, 
  dateRange, 
  onChangePeriodo, 
  onDateRangeChange 
}: MetasHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Metas de Gastos</h2>
        <p className="text-muted-foreground">
          Acompanhe e gerencie suas metas de gastos por categoria.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={periodoFiltro} onValueChange={onChangePeriodo}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mensal">Mensal</SelectItem>
            <SelectItem value="anual">Anual</SelectItem>
            <SelectItem value="personalizado">Personalizado</SelectItem>
          </SelectContent>
        </Select>
        
        <DateRangePicker 
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />
      </div>
    </div>
  );
}
