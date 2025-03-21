
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TransactionTableHeaderProps {
  isReadOnly?: boolean;
}

export function TransactionTableHeader({ isReadOnly = false }: TransactionTableHeaderProps) {
  return (
    <TableHeader className="bg-gray-50 dark:bg-gray-700/50 sticky top-0">
      <TableRow>
        <TableHead className="w-[100px] min-w-[100px]">Data</TableHead>
        <TableHead className="w-[280px] min-w-[200px]">Descrição</TableHead>
        <TableHead className="w-[180px] min-w-[150px]">Categoria</TableHead>
        <TableHead className="text-right w-[120px] min-w-[120px]">Valor</TableHead>
        {!isReadOnly && (
          <TableHead className="w-[80px] min-w-[80px] text-right">Ações</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
}
