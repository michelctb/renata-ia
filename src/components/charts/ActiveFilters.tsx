
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  selectedCategory: string | null;
  onClearCategory?: () => void;
  onClearAll?: () => void;
}

export function ActiveFilters({ 
  selectedCategory,
  onClearCategory,
  onClearAll
}: ActiveFiltersProps) {
  // Se não houver nada selecionado, não exibimos o componente
  if (!selectedCategory) return null;
  
  return (
    <div className="flex flex-wrap gap-2 items-center mb-4 p-3 bg-muted/50 rounded-md shadow-sm">
      <span className="text-sm font-medium mr-2">Filtros ativos:</span>
      
      {selectedCategory && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearCategory}
          className="h-7 px-2 text-xs flex items-center gap-1 bg-background"
        >
          Categoria: {selectedCategory}
          <X className="h-3 w-3" />
        </Button>
      )}
      
      {onClearAll && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearAll}
          className="ml-auto h-7 text-xs"
        >
          Limpar todos
        </Button>
      )}
    </div>
  );
}
