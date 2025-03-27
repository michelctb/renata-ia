
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ActiveFiltersProps {
  selectedMonth: string | null;
  selectedCategory: string | null;
  onClearMonth: () => void;
  onClearCategory: () => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  selectedMonth,
  selectedCategory,
  onClearMonth,
  onClearCategory,
  onClearAll
}: ActiveFiltersProps) {
  // Se não houver filtros ativos, não renderize nada
  if (!selectedMonth && !selectedCategory) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 animate-fade-in">
      <span className="text-sm font-medium text-muted-foreground">
        Filtros ativos:
      </span>
      
      {selectedMonth && (
        <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20">
          <span>Mês: {selectedMonth}</span>
          <X 
            size={14} 
            className="cursor-pointer hover:text-destructive" 
            onClick={onClearMonth}
          />
        </Badge>
      )}
      
      {selectedCategory && (
        <Badge variant="outline" className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20">
          <span>Categoria: {selectedCategory}</span>
          <X 
            size={14} 
            className="cursor-pointer hover:text-destructive" 
            onClick={onClearCategory}
          />
        </Badge>
      )}
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 px-2 text-xs"
        onClick={onClearAll}
      >
        Limpar todos
      </Button>
    </div>
  );
}
