
import { useState } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MetaCategoria, MetaProgresso } from '@/lib/metas';
import { formatCurrency } from '@/lib/utils';
import { MetaFormDialog } from './MetaFormDialog';
import { DeleteMetaDialog } from './DeleteMetaDialog';
import { MetaProgressBar } from './MetaProgressBar';

interface MetasListProps {
  userId: string;
  metas: MetaProgresso[];
  onSaveMeta: (meta: MetaCategoria) => Promise<void>;
  onDeleteMeta: (id: number) => Promise<void>;
}

export function MetasList({ userId, metas, onSaveMeta, onDeleteMeta }: MetasListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingMeta, setEditingMeta] = useState<MetaCategoria | null>(null);
  const [deletingMeta, setDeletingMeta] = useState<MetaCategoria | null>(null);
  
  const handleEdit = (meta: MetaCategoria) => {
    setEditingMeta(meta);
    setIsFormOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingMeta(null);
    setIsFormOpen(true);
  };
  
  const handleDelete = (meta: MetaCategoria) => {
    setDeletingMeta(meta);
    setIsDeleteOpen(true);
  };
  
  const confirmDelete = async () => {
    if (deletingMeta?.id) {
      await onDeleteMeta(deletingMeta.id);
      setIsDeleteOpen(false);
    }
  };
  
  // Renderizar uma mensagem quando não houver metas
  if (metas.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Metas de Gastos</h3>
          <Button onClick={handleAddNew} variant="default" size="sm">
            <PlusCircle className="h-4 w-4 mr-2" /> Nova Meta
          </Button>
        </div>
        
        <div className="text-center py-8 text-muted-foreground">
          <p>Você ainda não definiu nenhuma meta de gastos.</p>
          <p className="mt-2">Crie metas para ajudar a controlar seus gastos por categoria.</p>
        </div>
        
        <MetaFormDialog
          userId={userId}
          isOpen={isFormOpen}
          metaAtual={editingMeta}
          onOpenChange={setIsFormOpen}
          onSave={onSaveMeta}
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Metas de Gastos</h3>
        <Button onClick={handleAddNew} variant="default" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" /> Nova Meta
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoria</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Meta</TableHead>
              <TableHead>Gasto Atual</TableHead>
              <TableHead>Progresso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metas.map((metaProgresso) => {
              const { meta, valor_atual, porcentagem, status } = metaProgresso;
              
              // Formatar texto do período
              let periodoText = meta.periodo;
              if (meta.periodo === 'mensal' && meta.mes_referencia && meta.ano_referencia) {
                const month = new Date(0, meta.mes_referencia - 1).toLocaleString('pt-BR', { month: 'long' });
                periodoText = `${month} / ${meta.ano_referencia}`;
              } else if (meta.periodo === 'anual' && meta.ano_referencia) {
                periodoText = `Ano ${meta.ano_referencia}`;
              }
              
              return (
                <TableRow key={meta.id}>
                  <TableCell>{meta.categoria}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {periodoText}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(meta.valor_meta)}</TableCell>
                  <TableCell>{formatCurrency(valor_atual)}</TableCell>
                  <TableCell>
                    <MetaProgressBar valor={porcentagem} status={status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(meta)}
                      title="Editar meta"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(meta)}
                      title="Excluir meta"
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      <MetaFormDialog
        userId={userId}
        isOpen={isFormOpen}
        metaAtual={editingMeta}
        onOpenChange={setIsFormOpen}
        onSave={onSaveMeta}
      />
      
      <DeleteMetaDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={confirmDelete}
        categoria={deletingMeta?.categoria || ''}
      />
    </div>
  );
}
