
import { Lembrete } from '@/lib/lembretes';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';

interface LembretesListProps {
  lembretes: Lembrete[];
  isLoading?: boolean;
  onEdit: (lembrete: Lembrete) => void;
  onDelete: (id: number) => void;
  isUserActive?: boolean;
  viewMode?: 'user' | 'admin' | 'consultor';
}

export default function LembretesList({ 
  lembretes, 
  isLoading = false,
  onEdit, 
  onDelete, 
  isUserActive = true,
  viewMode = 'user'
}: LembretesListProps) {
  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-pulse-slow text-lg text-foreground">Carregando lembretes...</div>
      </div>
    );
  }

  if (lembretes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum lembrete cadastrado. Clique em "Novo Lembrete" para adicionar.
      </div>
    );
  }

  // Determine if interactions are allowed
  const isInteractive = isUserActive && viewMode !== 'consultor';

  return (
    <div className="rounded-md border border-border dark:border-gray-700 overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50 dark:bg-gray-800">
          <TableRow className="hover:bg-transparent dark:border-gray-700">
            <TableHead className="text-foreground dark:text-gray-300">Descrição</TableHead>
            <TableHead className="text-foreground dark:text-gray-300">Tipo</TableHead>
            <TableHead className="text-foreground dark:text-gray-300">Valor</TableHead>
            <TableHead className="text-foreground dark:text-gray-300">Vencimento</TableHead>
            <TableHead className="text-right text-foreground dark:text-gray-300">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lembretes.map((lembrete) => (
            <TableRow 
              key={lembrete.id} 
              className="dark:border-gray-700 dark:hover:bg-gray-700/40"
            >
              <TableCell className="font-medium dark:text-gray-200">{lembrete.lembrete}</TableCell>
              <TableCell className="dark:text-gray-300">
                <Badge variant="outline" className="capitalize">
                  {lembrete.tipo}
                </Badge>
              </TableCell>
              <TableCell className="dark:text-gray-300">
                {lembrete.valor ? formatCurrency(lembrete.valor) : '-'}
              </TableCell>
              <TableCell className="dark:text-gray-300">
                {format(new Date(lembrete.vencimento), 'dd/MM/yyyy', { locale: ptBR })}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(lembrete)}
                  className="h-8 w-8 p-0 mr-1 dark:hover:bg-gray-700"
                  disabled={!isInteractive}
                  title={
                    !isUserActive 
                      ? "Assinatura inativa. Não é possível editar lembretes."
                      : viewMode === 'consultor'
                        ? "Modo de visualização. Edição não permitida."
                        : "Editar lembrete"
                  }
                >
                  <PencilIcon className="h-4 w-4 dark:text-gray-300" />
                  <span className="sr-only">Editar</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(lembrete.id!)}
                  className={`h-8 w-8 p-0 dark:hover:bg-gray-700 ${
                    !isInteractive
                      ? "text-muted-foreground" 
                      : "text-destructive hover:text-destructive dark:text-red-400"
                  }`}
                  disabled={!isInteractive}
                  title={
                    !isUserActive 
                      ? "Assinatura inativa. Não é possível excluir lembretes."
                      : viewMode === 'consultor'
                        ? "Modo de visualização. Exclusão não permitida."
                        : "Excluir lembrete"
                  }
                >
                  <TrashIcon className="h-4 w-4" />
                  <span className="sr-only">Excluir</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
