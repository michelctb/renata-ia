
import { useState } from 'react';
import { Category } from '@/lib/categories';
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

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number, isPadrao: boolean) => void;
  isLoading: boolean;
}

export function CategoryList({ categories, onEdit, onDelete, isLoading }: CategoryListProps) {
  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-pulse-slow text-lg">Carregando categorias...</div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma categoria cadastrada. Clique em "Nova Categoria" para adicionar.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id} className={category.padrao ? "bg-slate-50" : ""}>
            <TableCell className="font-medium">{category.nome}</TableCell>
            <TableCell>
              {category.tipo === 'entrada' && 'Entrada'}
              {category.tipo === 'saída' && 'Saída'}
              {category.tipo === 'ambos' && 'Ambos'}
            </TableCell>
            <TableCell>
              {category.padrao ? (
                <Badge variant="secondary">Padrão</Badge>
              ) : (
                <Badge variant="outline">Personalizada</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(category)}
                className="h-8 w-8 p-0 mr-1"
                disabled={category.padrao}
                title={category.padrao ? "Categorias padrão não podem ser editadas" : "Editar categoria"}
              >
                <PencilIcon className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(category.id!, category.padrao || false)}
                className={`h-8 w-8 p-0 ${category.padrao ? "text-muted-foreground" : "text-destructive hover:text-destructive"}`}
                disabled={category.padrao}
                title={category.padrao ? "Categorias padrão não podem ser excluídas" : "Excluir categoria"}
              >
                <TrashIcon className="h-4 w-4" />
                <span className="sr-only">Excluir</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
