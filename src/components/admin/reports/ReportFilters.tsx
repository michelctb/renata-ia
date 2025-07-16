
import React from 'react';
import DateRangePicker from '@/components/DateRangePicker';
import { DateFilterButtons } from '@/components/DateFilterButtons';
import { DateRange } from 'react-day-picker';
import { Cliente } from '@/lib/clientes';
import { Info } from 'lucide-react';

interface ReportFiltersProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  selectedClient: string | null;
  onClientChange: (clientId: string | null) => void;
  clients: Cliente[];
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  dateRange,
  onDateRangeChange,
  selectedClient,
  onClientChange,
  clients,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-muted/20 p-3 rounded-lg border border-dashed flex items-start gap-2">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-blue-600 dark:text-blue-400">Como selecionar períodos para análise:</p>
          <p className="text-muted-foreground">Utilize os botões de período rápido ou selecione manualmente um intervalo de datas específico.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="text-sm font-medium mb-2 block">Selecione o período</label>
          <DateFilterButtons 
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            viewMode="admin"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Selecione o cliente</label>
          <select 
            className="w-full rounded-md border border-gray-300 p-2 dark:bg-gray-800 dark:border-gray-600"
            value={selectedClient || ''}
            onChange={(e) => onClientChange(e.target.value || null)}
          >
            <option value="">Todos os clientes</option>
            {clients.map(client => (
              <option key={client.id_cliente} value={client.id_cliente}>
                {client.nome || client.id_cliente}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
