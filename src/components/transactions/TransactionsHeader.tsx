
import { Input } from "@/components/ui/input";

interface TransactionsHeaderProps {
  onSearch: (value: string) => void;
  searchTerm: string;
  onAddNew: () => void;
  isUserActive: boolean;
  viewMode?: 'user' | 'admin' | 'consultor';
  selectedCategory?: string | null; // Adicionando selectedCategory
}

export function TransactionsHeader({
  onSearch,
  searchTerm,
  onAddNew,
  isUserActive,
  viewMode = 'user',
  selectedCategory
}: TransactionsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="search"
          placeholder="Buscar transações..."
          className="w-full"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      
      {/* Exibir a categoria selecionada, se houver */}
      {selectedCategory && (
        <div className="text-sm text-muted-foreground">
          Filtrando por categoria: <span className="font-medium">{selectedCategory}</span>
        </div>
      )}
    </div>
  );
}
