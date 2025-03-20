
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function TransactionTableHeader() {
  return (
    <TableHeader className="bg-gray-50 dark:bg-gray-700/50 sticky top-0">
      <TableRow>
        <TableHead className="w-[100px] min-w-[100px]">Data</TableHead>
        <TableHead className="w-[280px] min-w-[200px]">Descrição</TableHead>
        <TableHead className="w-[180px] min-w-[150px]">Categoria</TableHead>
        <TableHead className="text-right w-[120px] min-w-[120px]">Valor</TableHead>
        <TableHead className="w-[60px] min-w-[60px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
}
