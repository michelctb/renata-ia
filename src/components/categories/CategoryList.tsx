
import { useState } from 'react';
import { Category } from '@/lib/categories';
import { MetaCategoria } from '@/lib/metas';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon, TargetIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";

interface CategoryListProps {
  categories: Category[];
  metas?: Record<string, MetaCategoria>;
  onEdit: (category: Category, meta?: MetaCategoria | null) => void;
  onDelete: (id: number, isPadrao: boolean) => void;
  isLoading: boolean;
  isUserActive?: boolean;
  viewMode?: 'user' | 'admin' | 'consultor';
}

export function CategoryList({ 
  categories, 
  metas = {}, 
  onEdit, 
  onDelete, 
  isLoading, 
  isUserActive = true,
  viewMode = 'user'
}: CategoryListProps) {
  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-pulse-slow text-lg text-foreground">Carregando categorias...</div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma categoria cadastrada. Clique em "Nova Categoria" para adicionar.
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Determine if interactions are allowed
  const isInteractive = isUserActive && viewMode !== 'consultor';

  return (
    <div className="rounded-md border border-border dark:border-gray-700 overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50 dark:bg-gray-800">
          <TableRow className="hover:bg-transparent dark:border-gray-700">
            <TableHead className="text-foreground dark:text-gray-300">Nome</TableHead>
            <TableHead className="text-foreground dark:text-gray-300">Tipo</TableHead>
            <TableHead className="text-foreground dark:text-gray-300">Status</TableHead>
            <TableHead className="text-foreground dark:text-gray-300">Meta</TableHead>
            <TableHead className="text-right text-foreground dark:text-gray-300">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => {
            const meta = metas[category.nome];
            const hasMeta = !!meta;
            
            return (
              <TableRow 
                key={category.id} 
                className={`
                  ${category.padrao 
                    ? "bg-slate-50 dark:bg-gray-800/80" 
                    : "dark:bg-gray-800/40"}
                  dark:border-gray-700
                  dark:hover:bg-gray-700/40
                `}
              >
                <TableCell className="font-medium dark:text-gray-200">{category.nome}</TableCell>
                <TableCell className="dark:text-gray-300">
                  {category.tipo === 'entrada' && 'Entrada'}
                  {category.tipo === 'saída' && 'Saída'}
                  {category.tipo === 'ambos' && 'Ambos'}
                </TableCell>
                <TableCell>
                  {category.padrao ? (
                    <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-200">Padrão</Badge>
                  ) : (
                    <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">Personalizada</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {hasMeta ? (
                    <div className="flex items-center gap-1">
                      <TargetIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm dark:text-gray-300">{formatCurrency(meta.valor_meta)}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Não definida</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(category, meta || null)}
                    className="h-8 w-8 p-0 mr-1 dark:hover:bg-gray-700"
                    disabled={!isInteractive}
                    title={
                      !isUserActive 
                        ? "Assinatura inativa. Não é possível editar categorias."
                        : viewMode === 'consultor'
                          ? "Modo de visualização. Edição não permitida."
                          : category.padrao
                            ? "Você pode definir metas para categorias padrão"
                            : "Editar categoria"
                    }
                  >
                    <PencilIcon className="h-4 w-4 dark:text-gray-300" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(category.id!, category.padrao || false)}
                    className={`h-8 w-8 p-0 dark:hover:bg-gray-700 ${
                      category.padrao || !isInteractive
                        ? "text-muted-foreground" 
                        : "text-destructive hover:text-destructive dark:text-red-400"
                    }`}
                    disabled={category.padrao || !isInteractive}
                    title={
                      category.padrao 
                        ? "Categorias padrão não podem ser excluídas" 
                        : !isUserActive 
                          ? "Assinatura inativa. Não é possível excluir categorias."
                          : viewMode === 'consultor'
                            ? "Modo de visualização. Exclusão não permitida."
                            : "Excluir categoria"
                    }
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
