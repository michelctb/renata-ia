
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { MetaProgresso } from '@/lib/metas';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MetaComparisonChartProps {
  metasComProgresso: MetaProgresso[];
}

export function MetaComparisonChart({ metasComProgresso }: MetaComparisonChartProps) {
  // Preparar os dados para o gráfico
  const chartData = useMemo(() => {
    return metasComProgresso.map(item => ({
      name: item.meta.categoria,
      meta: item.meta.valor_meta,
      atual: item.valor_atual,
      porcentagem: Math.round(item.porcentagem * 100),
    }));
  }, [metasComProgresso]);

  // Se não houver dados, exibir mensagem
  if (!chartData.length) {
    return (
      <Card className="overflow-hidden h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Gastos vs Metas</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground text-center">
            Nenhuma meta definida para o período atual
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Gastos vs Metas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value).replace('R$', '')}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Categoria: ${label}`}
              />
              <Legend />
              <Bar 
                name="Meta" 
                dataKey="meta" 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                name="Atual" 
                dataKey="atual" 
                fill="#82ca9d" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
