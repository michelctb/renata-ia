
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MetaProgressBar } from './MetaProgressBar';
import { MetaFormDialog } from './MetaFormDialog';
import { DeleteMetaDialog } from './DeleteMetaDialog';
import { Plus, Pencil, Trash } from 'lucide-react';
import { MetaCategoria, MetaProgresso } from '@/lib/metas';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface MetasListProps {
  userId: string;
  metas: MetaProgresso[];
  onSaveMeta: (meta: MetaCategoria) => Promise<void>;
  onDeleteMeta: (id: number) => Promise<void>;
}

export function MetasList({ userId, metas, onSaveMeta, onDeleteMeta }: MetasListProps) {
  const [metaFormOpen, setMetaFormOpen] = useState(false);
  const [metaAtual, setMetaAtual] = useState<MetaCategoria | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [metaToDelete, setMetaToDelete] = useState<number | null>(null);
  
  // Ordenar metas por porcentagem (crescente)
  const metasOrdenadas = [...metas].sort((a, b) => b.porcentagem - a.porcentagem);
  
  // Solicitar adição de uma nova meta
  const handleAddMeta = () => {
    setMetaAtual(null);
    setMetaFormOpen(true);
  };
  
  // Solicitar edição de uma meta existente
  const handleEditMeta = (meta: MetaCategoria) => {
    setMetaAtual(meta);
    setMetaFormOpen(true);
  };
  
  // Abrir diálogo de confirmação para excluir meta
  const handleDeleteRequest = (id: number) => {
    setMetaToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  // Confirmar exclusão de meta
  const confirmDelete = async () => {
    if (metaToDelete !== null) {
      await onDeleteMeta(metaToDelete);
      setMetaToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };
  
  // Renderizar período da meta em formato legível
  const renderPeriodo = (meta: MetaCategoria) => {
    if (meta.periodo === 'mensal' && meta.mes_referencia && meta.ano_referencia) {
      const date = new Date(meta.ano_referencia, meta.mes_referencia - 1, 1);
      return format(date, 'MMMM / yyyy', { locale: pt });
    } else if (meta.periodo === 'anual' && meta.ano_referencia) {
      return `Ano ${meta.ano_referencia}`;
    } else {
      return meta.periodo;
    }
  };

  return (
    <div className="space-y-6">
      {/* Botão para adicionar nova meta */}
      <div className="flex justify-end">
        <Button onClick={handleAddMeta} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Nova Meta
        </Button>
      </div>
      
      {/* Lista de metas */}
      {metasOrdenadas.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {metasOrdenadas.map((metaProgresso) => (
            <Card key={metaProgresso.meta.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold">
                    {metaProgresso.meta.categoria}
                  </CardTitle>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditMeta(metaProgresso.meta)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRequest(metaProgresso.meta.id!)}
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Período: {renderPeriodo(metaProgresso.meta)}
                </div>
              </CardHeader>
              
              <CardContent>
                <MetaProgressBar
                  valor_atual={metaProgresso.valor_atual}
                  valor_meta={metaProgresso.meta.valor_meta}
                  porcentagem={metaProgresso.porcentagem}
                  status={metaProgresso.status}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Você ainda não definiu nenhuma meta de gastos.
          </p>
          <Button onClick={handleAddMeta} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Adicionar Meta
          </Button>
        </div>
      )}
      
      {/* Diálogos */}
      <MetaFormDialog 
        userId={userId}
        isOpen={metaFormOpen} 
        metaAtual={metaAtual}
        onOpenChange={setMetaFormOpen} 
        onSave={onSaveMeta} 
      />
      
      <DeleteMetaDialog 
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
