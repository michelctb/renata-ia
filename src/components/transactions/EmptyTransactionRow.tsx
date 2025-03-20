
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';

interface EmptyTransactionRowProps {
  hasFilters: boolean;
}

export function EmptyTransactionRow({ hasFilters }: EmptyTransactionRowProps) {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
        {hasFilters
          ? "Nenhuma transação encontrada para os filtros selecionados."
          : "Nenhuma transação registrada ainda."}
      </TableCell>
    </TableRow>
  );
}
