
import { formatCurrency } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps,
} from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';

interface MonthlyChartProps {
  data: Array<{
    name: string;
    entrada: number;
    saída: number;
  }>;
  onMonthClick?: (month: string) => void;
  selectedMonth?: string | null;
  isEmpty?: boolean;
  mode?: 'all' | 'filtered';
}

// Custom tooltip para o gráfico de barras
const CustomBarTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-md">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value as number)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function MonthlyChart({ data, onMonthClick, selectedMonth, isEmpty = false, mode = 'all' }: MonthlyChartProps) {
  const isMobile = useIsMobile();
  const [chartHeight, setChartHeight] = useState(270); // Altura inicial segura
  const [chartWidth, setChartWidth] = useState('100%');
  const [hasError, setHasError] = useState(false);

  // Verificar se os dados são válidos
  const isDataValid = Array.isArray(data) && data.length > 0;
  
  // Efeito para garantir que as dimensões sejam atualizadas após a renderização
  useEffect(() => {
    try {
      // Log detalhado para depuração
      console.log('MonthlyChart - Dados recebidos:', {
        data,
        isValid: isDataValid,
        count: data?.length || 0,
        mode
      });
    } catch (error) {
      console.error('Erro ao logar dados do gráfico:', error);
      setHasError(true);
    }
  }, [data, isDataValid, mode]);
  
  if (hasError) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-red-500">
        <p className="text-center">Erro ao renderizar o gráfico</p>
        <button 
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
          onClick={() => window.location.reload()}
        >
          Recarregar página
        </button>
      </div>
    );
  }
  
  if (isEmpty || !isDataValid) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
        <p className="mb-2">
          {mode === 'filtered' 
            ? "Sem dados para o período filtrado" 
            : "Sem dados para exibir"}
        </p>
        <p className="text-sm text-gray-500">
          {mode === 'filtered' 
            ? "Tente selecionar outro período ou alternar para a visualização completa" 
            : "Tente adicionar transações"}
        </p>
      </div>
    );
  }

  // Função para lidar com o clique em uma barra
  const handleBarClick = (data: any) => {
    console.log('MonthlyChart - Clique no mês:', data.name);
    if (onMonthClick) {
      onMonthClick(data.name);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="w-full h-[270px]">
        <BarChart
          width={isMobile ? 350 : 650}
          height={chartHeight}
          data={data}
          margin={isMobile ? 
            { top: 10, right: 5, left: 0, bottom: 20 } : 
            { top: 20, right: 20, left: 20, bottom: 20 }}
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={(props: any) => {
              // Destacar o mês selecionado
              const isSelected = selectedMonth === props.payload.value;
              return (
                <text
                  x={props.x}
                  y={props.y}
                  dy={16}
                  textAnchor="middle"
                  fill={isSelected ? '#3b82f6' : 'currentColor'}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  fontSize={isMobile ? 10 : 12}
                >
                  {props.payload.value}
                </text>
              );
            }}
            height={30}
            interval={isMobile ? 1 : 0}
          />
          <YAxis 
            tickFormatter={(value) => isMobile ? 
              `${value/1000}k` : 
              formatCurrency(value).split(',')[0]} 
            width={isMobile ? 30 : undefined}
            fontSize={isMobile ? 10 : 12}
          />
          <Tooltip 
            content={<CustomBarTooltip />} 
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Legend 
            wrapperStyle={isMobile ? { fontSize: '10px', marginTop: '10px' } : { marginTop: '10px' }}
          />
          <Bar 
            dataKey="entrada" 
            name="Entradas" 
            fill="#4ade80" 
            onClick={handleBarClick}
            cursor="pointer"
            isAnimationActive={false}
          />
          <Bar 
            dataKey="saída" 
            name="Saídas" 
            fill="#f87171" 
            onClick={handleBarClick}
            cursor="pointer"
            isAnimationActive={false}
          />
        </BarChart>
      </div>
      <div className="text-xs text-muted-foreground text-right pr-2 mt-2">
        {selectedMonth 
          ? `Filtro aplicado: ${selectedMonth} (clique novamente para remover)` 
          : isMobile ? 'Toque para filtrar' : 'Clique em um mês para filtrar'}
      </div>
    </div>
  );
}
