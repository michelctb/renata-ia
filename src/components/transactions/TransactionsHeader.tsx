
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface TransactionsHeaderProps {
  onSearch: (value: string) => void;
  searchTerm: string;
  onAddNew: () => void;
  isUserActive: boolean;
  viewMode?: 'user' | 'admin' | 'consultor';
}

export function TransactionsHeader({
  onSearch,
  searchTerm,
  onAddNew,
  isUserActive,
  viewMode = 'user'
}: TransactionsHeaderProps) {
  const isReadOnly = viewMode === 'consultor';
  
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
      
      <div>
        {!isReadOnly && (
          <Button 
            onClick={onAddNew} 
            disabled={!isUserActive}
            className="whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        )}
      </div>
    </div>
  );
}
