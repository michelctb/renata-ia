
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ChartSelectorProps {
  transactionType: 'saída' | 'entrada';
  setTransactionType: (value: 'saída' | 'entrada') => void;
}

export function ChartSelector({ transactionType, setTransactionType }: ChartSelectorProps) {
  return (
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
  );
}
