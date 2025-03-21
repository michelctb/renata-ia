
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChartSelectorProps {
  transactionType: 'saída' | 'entrada';
  setTransactionType: (value: 'saída' | 'entrada') => void;
}

export function ChartSelector({ 
  transactionType, 
  setTransactionType
}: ChartSelectorProps) {
  return (
    <Tabs 
      value={transactionType} 
      onValueChange={(value) => setTransactionType(value as 'saída' | 'entrada')}
      className="hidden sm:block"
    >
      <TabsList className="bg-background">
        <TabsTrigger value="saída" className="text-xs">Despesas</TabsTrigger>
        <TabsTrigger value="entrada" className="text-xs">Receitas</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
