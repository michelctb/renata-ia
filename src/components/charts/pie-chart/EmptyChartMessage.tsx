
interface EmptyChartMessageProps {
  transactionType: 'entrada' | 'saída';
}

export const EmptyChartMessage = ({ transactionType }: EmptyChartMessageProps) => (
  <div className="h-full flex items-center justify-center text-muted-foreground">
    {transactionType === 'saída' 
      ? 'Sem dados de saída para exibir no período selecionado'
      : 'Sem dados de entrada para exibir no período selecionado'
    }
  </div>
);
