
import { RankingCategoryItem } from './RankingCategoryItem';
import { EmptyRankingMessage } from './EmptyRankingMessage';
import { useExpensesRankingData } from '../hooks/useExpensesRankingData';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RankingData {
  name: string;
  value: number;
}

interface ExpensesRankingProps {
  data: RankingData[];
  transactionType: 'saída' | 'entrada';
  onCategoryClick?: (category: string) => void;
  selectedCategory?: string | null;
}

export function ExpensesRanking({ 
  data, 
  transactionType,
  onCategoryClick,
  selectedCategory
}: ExpensesRankingProps) {
  // Processar os dados para exibição
  const { hasData, dataToShow, totalValue, showMoreMessage, totalCategories } = useExpensesRankingData(data, transactionType);
  
  // Exibir mensagem se não houver dados
  if (!hasData) {
    return <EmptyRankingMessage transactionType={transactionType} />;
  }
  
  return (
    <>
      <ScrollArea className="h-full">
        <div className="space-y-1">
          {dataToShow.map((category, index) => (
            <RankingCategoryItem 
              key={`${category.name}-${index}`}
              name={category.name}
              value={category.value}
              index={index}
              transactionType={transactionType}
              onClick={onCategoryClick}
              isSelected={selectedCategory === category.name}
            />
          ))}
        </div>
      </ScrollArea>
      
      {showMoreMessage && (
        <div className="text-sm text-muted-foreground text-center mt-2">
          Mostrando as 15 categorias principais de um total de {totalCategories}
        </div>
      )}
      
      <div className="mt-4 text-sm font-medium">
        <span>Total: </span>
        <span className={transactionType === 'saída' ? 'text-expense' : 'text-income'}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
        </span>
      </div>
    </>
  );
}
