
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyChart } from './MonthlyChart';

interface MonthlyChartCardProps {
  data: Array<{
    name: string;
    entrada: number;
    saída: number;
  }>;
}

export function MonthlyChartCard({ data }: MonthlyChartCardProps) {
  return (
    <Card className="border-none shadow-md animate-fade-up col-span-1 lg:col-span-3" style={{ animationDelay: '0.1s' }}>
      <CardHeader className="pb-2">
        <CardTitle>Entradas e Saídas por Mês</CardTitle>
        <CardDescription>Visualização mensal de valores recebidos e pagos</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <MonthlyChart data={data} />
      </CardContent>
    </Card>
  );
}
