
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface MetaVsActualChartProps {
  data: {
    name: string;
    meta: number;
    real: number;
    percentual: number;
  }[];
  totalMeta: number;
  totalReal: number;
  transactionType: 'saída' | 'entrada';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-md">
        <p className="font-medium">{label}</p>
        <p className="text-sm">
          <span className="text-blue-600">Meta: </span>
          {formatCurrency(payload[0].payload.meta)}
        </p>
        <p className="text-sm">
          <span className={payload[1].payload.real > payload[0].payload.meta 
            ? 'text-red-600' 
            : 'text-green-600'}>
            Real: 
          </span>
          {formatCurrency(payload[1].payload.real)}
        </p>
        <p className="text-sm font-medium">
          {payload[1].payload.percentual}% da meta
        </p>
      </div>
    );
  }
  return null;
};

export function MetaVsActualChart({ data, totalMeta, totalReal, transactionType }: MetaVsActualChartProps) {
  // Se não houver dados para exibir
  if (!data || data.length === 0) {
    return (
      <Card className="border-none shadow-md animate-fade-up col-span-3">
        <CardHeader className="pb-2">
          <CardTitle>Comparativo: {transactionType === 'saída' ? 'Gastos' : 'Entradas'} vs Metas</CardTitle>
          <CardDescription>
            Não há metas definidas para comparação.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">
            Defina metas para visualizar o comparativo.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Limitar a quantidade de categorias exibidas para melhor visualização
  const displayData = data.slice(0, 10);
  
  // Determinar classes CSS com base no tipo de transação
  const statusTextColor = transactionType === 'saída' 
    ? (totalReal > totalMeta ? 'text-red-600' : 'text-green-600')
    : (totalReal > totalMeta ? 'text-green-600' : 'text-red-600');
  
  const metaBarColor = transactionType === 'saída' ? '#8884d8' : '#82ca9d';
  const realBarColor = transactionType === 'saída' ? '#ff7c7c' : '#4caf50';

  return (
    <Card className="border-none shadow-md animate-fade-up col-span-3">
      <CardHeader className="pb-2">
        <CardTitle>Comparativo: {transactionType === 'saída' ? 'Gastos' : 'Entradas'} vs Metas</CardTitle>
        <CardDescription className="flex flex-col sm:flex-row sm:justify-between">
          <span>Visualize a relação entre os valores planejados e realizados</span>
          <div className="mt-2 sm:mt-0">
            <span className="font-medium">Total Meta: </span>
            <span>{formatCurrency(totalMeta)}</span>
            <span className="mx-2">|</span>
            <span className="font-medium">Total Real: </span>
            <span className={statusTextColor}>{formatCurrency(totalReal)}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 50,
              }}
              barGap={0}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={80} 
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine y={0} stroke="#000" />
              <Bar dataKey="meta" name="Meta" fill={metaBarColor} />
              <Bar dataKey="real" name="Realizado" fill={realBarColor} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
