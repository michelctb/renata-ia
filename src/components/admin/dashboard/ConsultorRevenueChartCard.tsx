
import { Cliente } from '@/lib/clientes';
import { ConsultorRevenueChart } from './ConsultorRevenueChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface ConsultorRevenueChartCardProps {
  clients: Cliente[];
}

export const ConsultorRevenueChartCard = ({
  clients
}: ConsultorRevenueChartCardProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="col-span-1 lg:col-span-2 border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Faturamento Mensal</CardTitle>
        <CardDescription>Evolução de adesões e recorrências</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ConsultorRevenueChart clients={clients} isMobile={isMobile} />
      </CardContent>
    </Card>
  );
};
