
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChartIcon, BarChartIcon } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface ChartSelectorProps {
  transactionType: 'saída' | 'entrada';
  setTransactionType: (value: 'saída' | 'entrada') => void;
  selectedView?: 'pie' | 'ranking';
  setSelectedView?: Dispatch<SetStateAction<'pie' | 'ranking'>>;
}

export function ChartSelector({ 
  transactionType, 
  setTransactionType,
  selectedView,
  setSelectedView
}: ChartSelectorProps) {
  return (
    <div className="flex gap-2">
      {/* Transaction type selector */}
      <ToggleGroup 
        type="single" 
        value={transactionType} 
        onValueChange={(value) => value && setTransactionType(value as 'saída' | 'entrada')}
      >
        <ToggleGroupItem 
          value="saída" 
          aria-label="Mostrar saídas" 
          className={transactionType === 'saída' ? 'bg-expense text-white hover:text-white' : ''}
        >
          Saídas
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="entrada" 
          aria-label="Mostrar entradas" 
          className={transactionType === 'entrada' ? 'bg-income text-white hover:text-white' : ''}
        >
          Entradas
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Chart type selector (only render if props are provided) */}
      {selectedView && setSelectedView && (
        <Tabs
          value={selectedView}
          onValueChange={(value) => setSelectedView(value as 'pie' | 'ranking')}
          className="ml-2"
        >
          <TabsList className="h-9">
            <TabsTrigger value="pie" className="px-3">
              <PieChartIcon className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="ranking" className="px-3">
              <BarChartIcon className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
    </div>
  );
}
