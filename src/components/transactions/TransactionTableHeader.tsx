
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface TransactionTableHeaderProps {
  isReadOnly?: boolean;
  hasSelection?: boolean;
  onSelectAll?: (checked: boolean) => void;
  allSelected?: boolean;
}

export function TransactionTableHeader({ 
  isReadOnly = false, 
  hasSelection = false,
  onSelectAll,
  allSelected = false
}: TransactionTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        {hasSelection && !isReadOnly && (
          <TableHead className="w-[50px]">
            <Checkbox 
              checked={allSelected} 
              onCheckedChange={onSelectAll}
              aria-label="Selecionar todas as transações"
            />
          </TableHead>
        )}
        <TableHead className="w-[100px]">Data</TableHead>
        <TableHead>Descrição</TableHead>
        <TableHead>Categoria</TableHead>
        <TableHead className="text-right">Valor</TableHead>
        {!isReadOnly && (
          <TableHead className="text-right">Ações</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
}
