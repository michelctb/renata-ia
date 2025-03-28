
import { Cliente } from '@/lib/clientes';
import { ConsultorRevenueChart } from './ConsultorRevenueChart';

interface ConsultorRevenueChartCardProps {
  clients: Cliente[];
}

export const ConsultorRevenueChartCard = ({ clients }: ConsultorRevenueChartCardProps) => {
  return (
    <div className="w-full h-full flex justify-center items-center p-2">
      <ConsultorRevenueChart clients={clients} />
    </div>
  );
};
