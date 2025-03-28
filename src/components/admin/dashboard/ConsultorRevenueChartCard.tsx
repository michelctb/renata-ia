
import { Cliente } from '@/lib/clientes';
import { ConsultorRevenueChart } from './ConsultorRevenueChart';

interface ConsultorRevenueChartCardProps {
  clients: Cliente[];
}

export const ConsultorRevenueChartCard = ({ clients }: ConsultorRevenueChartCardProps) => {
  return (
    <div className="w-full h-full">
      <ConsultorRevenueChart clients={clients} />
    </div>
  );
};
