
import { useState } from 'react';
import { MetaFormDialog } from './MetaFormDialog';
import { DeleteMetaDialog } from './DeleteMetaDialog';
import { MetaCategoria, MetaProgresso } from '@/lib/metas';
import { MetasActionsButton } from './components/MetasActionsButton';
import { MetasEmptyState } from './components/MetasEmptyState';
import { MetaItem } from './components/MetaItem';

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
  const [categoriaToDelete, setCategoriaToDelete] = useState<string>('');
  
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
  const handleDeleteRequest = (id: number, categoria: string) => {
    setMetaToDelete(id);
    setCategoriaToDelete(categoria);
    setDeleteConfirmOpen(true);
  };
  
  // Confirmar exclusão de meta
  const confirmDelete = async () => {
    if (metaToDelete !== null) {
      await onDeleteMeta(metaToDelete);
      setMetaToDelete(null);
      setCategoriaToDelete('');
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Botão para adicionar nova meta */}
      <MetasActionsButton onAddMeta={handleAddMeta} />
      
      {/* Lista de metas */}
      {metasOrdenadas.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {metasOrdenadas.map((metaProgresso) => (
            <MetaItem 
              key={metaProgresso.meta.id}
              metaProgresso={metaProgresso}
              onEdit={handleEditMeta}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      ) : (
        <MetasEmptyState onAddMeta={handleAddMeta} />
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
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
        categoria={categoriaToDelete}
      />
    </div>
  );
}
