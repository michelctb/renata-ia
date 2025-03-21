
interface EmptyRankingMessageProps {
  transactionType: 'entrada' | 'saída';
}

export const EmptyRankingMessage = ({ transactionType }: EmptyRankingMessageProps) => (
  <div className="h-[290px] flex items-center justify-center text-muted-foreground">
    {transactionType === 'saída' 
      ? 'Sem dados de saída para exibir no período selecionado'
      : 'Sem dados de entrada para exibir no período selecionado'
    }
  </div>
);
