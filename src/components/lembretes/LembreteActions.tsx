
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { DeleteLembreteDialog } from './DeleteLembreteDialog';
import { Lembrete, deleteLembrete } from '@/lib/lembretes';

interface LembreteActionsProps {
  onAdd: () => void;
  isActive: boolean;
  viewMode?: 'user' | 'admin' | 'consultor';
}

export function LembreteActions({
  onAdd,
  isActive,
  viewMode = 'user'
}: LembreteActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lembreteToDelete, setLembreteToDelete] = useState<Lembrete | null>(null);

  const handleAddNew = () => {
    // Verificar se o usuário está ativo
    if (!isActive) {
      toast.error('Sua conta está inativa. Por favor, atualize seu plano para continuar.');
      return;
    }

    // Verificar se está no modo consultor
    if (viewMode === 'consultor') {
      toast.info('Você está em modo de visualização e não pode adicionar lembretes.');
      return;
    }

    // Chamar função para adicionar
    onAdd();
  };

  // Handle a request to delete a lembrete
  const handleDeleteRequest = (lembrete: Lembrete) => {
    if (!isActive) {
      toast.error('Sua conta está inativa. Por favor, atualize seu plano para continuar.');
      return;
    }

    if (viewMode === 'consultor') {
      toast.info('Você está em modo de visualização e não pode excluir lembretes.');
      return;
    }

    setLembreteToDelete(lembrete);
    setDeleteDialogOpen(true);
  };

  // Handle confirmation of deletion
  const handleConfirmDelete = async () => {
    if (!lembreteToDelete || !lembreteToDelete.id) {
      toast.error('Erro ao excluir lembrete: ID não fornecido');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteLembrete(lembreteToDelete.id);
      toast.success('Lembrete excluído com sucesso!');
      setDeleteDialogOpen(false);
      setLembreteToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir lembrete:', error);
      toast.error('Erro ao excluir lembrete. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <Button 
        onClick={handleAddNew}
        className="flex items-center space-x-2"
        variant="default"
        disabled={!isActive || viewMode === 'consultor'}
      >
        <PlusCircle className="h-4 w-4" />
        <span>Novo Lembrete</span>
      </Button>

      {lembreteToDelete && (
        <DeleteLembreteDialog
          isOpen={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          lembreteId={lembreteToDelete.id || null}
          lembrete={lembreteToDelete}
        />
      )}
    </div>
  );
}
