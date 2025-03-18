
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchLembretes, Lembrete, deleteLembrete } from '@/lib/lembretes';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import LembreteForm from '@/components/lembretes/LembreteForm';
import LembretesList from '@/components/lembretes/LembretesList';

const LembretesTab = () => {
  const { user, isUserActive } = useAuth();
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLembrete, setEditingLembrete] = useState<Lembrete | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadLembretes = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const data = await fetchLembretes(user.id);
      console.log(`Loaded ${data.length} lembretes for user ${user.id}`);
      setLembretes(data);
    } catch (error) {
      console.error('Error loading lembretes:', error);
      toast.error('Erro ao carregar lembretes. Atualize a página.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLembretes();
  }, [user]);

  const handleAddNew = () => {
    // Block inactive users from adding lembretes
    if (!isUserActive()) {
      toast.error('Sua assinatura está inativa. Você não pode adicionar lembretes.');
      return;
    }
    
    setEditingLembrete(null);
    setIsFormOpen(true);
  };

  const handleEdit = (lembrete: Lembrete) => {
    // Block inactive users from editing lembretes
    if (!isUserActive()) {
      toast.error('Sua assinatura está inativa. Você não pode editar lembretes.');
      return;
    }
    
    console.log('Editing lembrete:', lembrete);
    // Ensure we create a deep copy to avoid reference issues
    setEditingLembrete({...lembrete});
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingLembrete(null);
  };

  const handleFormSubmit = async (data: Lembrete) => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      console.log('Form submitted with data:', data);
      // Always reload the list after adding or updating a lembrete
      await loadLembretes();
    } catch (error) {
      console.error('Error updating lembretes list:', error);
      toast.error('Erro ao atualizar a lista de lembretes.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: number) => {
    // Block inactive users from deleting lembretes
    if (!isUserActive()) {
      toast.error('Sua assinatura está inativa. Você não pode excluir lembretes.');
      return;
    }
    
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      console.log('Deleting lembrete with ID:', id);
      await deleteLembrete(id);
      toast.success('Lembrete excluído com sucesso');
      await loadLembretes(); // Recarrega a lista após exclusão
    } catch (error) {
      console.error('Error deleting lembrete:', error);
      toast.error('Erro ao excluir o lembrete. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading && lembretes.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-pulse text-lg">Carregando lembretes...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Lembretes</h2>
        <Button onClick={handleAddNew} disabled={!isUserActive() || isProcessing}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Novo Lembrete
        </Button>
      </div>

      <LembretesList 
        lembretes={lembretes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isUserActive={isUserActive()}
        isProcessing={isProcessing}
      />

      <LembreteForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editingLembrete={editingLembrete}
        userId={user?.id || ''}
      />
    </div>
  );
};

export default LembretesTab;
