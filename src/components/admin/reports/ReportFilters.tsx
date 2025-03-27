
import React from 'react';
import DateRangePicker from '@/components/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { Cliente } from '@/lib/clientes';

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-2">
        <label className="text-sm font-medium mb-2 block">Selecione o período</label>
        <DateRangePicker 
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          className="w-full"
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
  );
};

export default ReportFilters;
