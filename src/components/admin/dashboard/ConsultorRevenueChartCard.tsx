
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cliente } from '@/lib/clientes';
import { ConsultorRevenueChart } from './ConsultorRevenueChart';
import { ChartBar } from 'lucide-react';

interface ConsultorRevenueChartCardProps {
  clients: Cliente[];
}

export const ConsultorRevenueChartCard = ({ clients }: ConsultorRevenueChartCardProps) => {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 h-full w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-semibold">Faturamento Mensal</CardTitle>
          <CardDescription>Evolução de adesões e recorrências</CardDescription>
        </div>
        <ChartBar className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex justify-center items-center h-[350px] w-full">
        <ConsultorRevenueChart clients={clients} />
      </CardContent>
    </Card>
  );
};
