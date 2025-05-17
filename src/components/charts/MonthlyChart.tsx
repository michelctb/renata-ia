
import { formatCurrency } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface MonthlyChartProps {
  data: Array<{
    name: string;
    entrada: number;
    saída: number;
  }>;
  onMonthClick?: (month: string) => void;
  selectedMonth?: string | null;
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

export function MonthlyChart({ data, onMonthClick, selectedMonth }: MonthlyChartProps) {
  const isMobile = useIsMobile();

  // Verificar se os dados são válidos
  const isDataValid = Array.isArray(data) && data.length > 0;
  
  // Log detalhado para depuração
  console.log('MonthlyChart - Dados recebidos:', {
    data,
    isValid: isDataValid,
    count: data?.length || 0
  });
  
  if (!isDataValid) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
        <p className="mb-2">Sem dados para exibir</p>
        <p className="text-sm text-gray-500">Tente selecionar outro período ou adicionar transações</p>
      </div>
    );
  }

  console.log('MonthlyChart - Renderizando com dados:', data);

  // Função para lidar com o clique em uma barra
  const handleBarClick = (data: any) => {
    console.log('MonthlyChart - Clique no mês:', data.name);
    if (onMonthClick) {
      onMonthClick(data.name);
    }
  };

  return (
    <div className="relative h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={isMobile ? 
            { top: 10, right: 5, left: 0, bottom: 10 } : 
            { top: 20, right: 20, left: 20, bottom: 10 }}
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
            wrapperStyle={isMobile ? { fontSize: '10px' } : undefined}
          />
          <Bar 
            dataKey="entrada" 
            name="Entradas" 
            fill="#4ade80" 
            onClick={handleBarClick}
            cursor="pointer"
            isAnimationActive={false}
            onMouseOver={() => {
              document.body.style.cursor = 'pointer';
            }}
            onMouseOut={() => {
              document.body.style.cursor = 'default';
            }}
          />
          <Bar 
            dataKey="saída" 
            name="Saídas" 
            fill="#f87171" 
            onClick={handleBarClick}
            cursor="pointer"
            isAnimationActive={false}
            onMouseOver={() => {
              document.body.style.cursor = 'pointer';
            }}
            onMouseOut={() => {
              document.body.style.cursor = 'default';
            }}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 right-0 text-xs text-muted-foreground pr-2 pb-1">
        {selectedMonth 
          ? `Filtro aplicado: ${selectedMonth} (clique novamente para remover)` 
          : isMobile ? 'Toque para filtrar' : 'Clique em um mês para filtrar'}
      </div>
    </div>
  );
}
