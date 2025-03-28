
import { Cliente } from '@/lib/clientes';
import { ConsultorRevenueChart } from './ConsultorRevenueChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConsultorRevenueChartCardProps {
  clients: Cliente[];
}

export const ConsultorRevenueChartCard = ({ clients }: ConsultorRevenueChartCardProps) => {
  return (
    <Card className="col-span-1 lg:col-span-2 border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Faturamento do Consultor</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <ConsultorRevenueChart clients={clients} />
      </CardContent>
    </Card>
  );
};
