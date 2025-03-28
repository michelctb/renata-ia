import { Cliente } from '@/lib/clientes';
import { ConsultorRevenueChart } from './ConsultorRevenueChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
interface ConsultorRevenueChartCardProps {
  clients: Cliente[];
}
export const ConsultorRevenueChartCard = ({
  clients
}: ConsultorRevenueChartCardProps) => {
  return <Card className="col-span-1 lg:col-span-2 border shadow-sm">
      
      <CardContent className="pb-4">
        <ConsultorRevenueChart clients={clients} />
      </CardContent>
    </Card>;
};