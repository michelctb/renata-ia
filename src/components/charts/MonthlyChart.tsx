
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

interface MonthlyChartProps {
  data: Array<{
    name: string;
    entrada: number;
    saída: number;
  }>;
  onMonthClick?: (month: string) => void;
  selectedMonth?: string | null;
}

// Custom tooltip for bar chart
const CustomBarTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-md">
        <p className="font-medium">{payload[0].payload.name}</p>
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
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Sem dados para exibir
      </div>
    );
  }

  // Função para lidar com o clique em uma barra
  const handleBarClick = (data: any) => {
    if (onMonthClick) {
      onMonthClick(data.name);
    }
  };

  return (
    <div className="relative h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ 
              fill: (props: any) => {
                // Destacar o mês selecionado
                const isSelected = selectedMonth === props.payload.value;
                return isSelected ? '#3b82f6' : 'currentColor';
              },
              fontWeight: (props: any) => {
                const isSelected = selectedMonth === props.payload.value;
                return isSelected ? 'bold' : 'normal';
              }
            }}
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value).split(',')[0]} 
          />
          <Tooltip content={<CustomBarTooltip />} />
          <Legend />
          <Bar 
            dataKey="entrada" 
            name="Entradas" 
            fill="#4ade80" 
            onClick={handleBarClick}
            // Adicionar cursor pointer para indicar que é clicável
            cursor="pointer" 
            // Estilizar a barra quando estiver sobre ela
            onMouseOver={(data, index) => {
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
        Dados de todo período {selectedMonth ? `(clique novamente em ${selectedMonth} para remover o filtro)` : '(clique em um mês para filtrar)'}
      </div>
    </div>
  );
}
