
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
  const [formSubmissionCount, setFormSubmissionCount] = useState(0);

  const loadLembretes = async () => {
    if (!user) return;
    
    try {
      console.log('Loading lembretes...');
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
    console.log('User effect triggered, loading lembretes');
    loadLembretes();
  }, [user]);

  // Separate effect for form submission to avoid race conditions
  useEffect(() => {
    if (formSubmissionCount > 0) {
      console.log('Form submission detected, reloading lembretes');
      loadLembretes();
    }
  }, [formSubmissionCount]);

  const handleAddNew = () => {
    // Block inactive users from adding lembretes
    if (!isUserActive()) {
      toast.error('Sua assinatura está inativa. Você não pode adicionar lembretes.');
      return;
    }
    
    console.log('Adding new lembrete, clearing editing state');
    setEditingLembrete(null);
    setIsFormOpen(true);
  };

  const handleEdit = (lembrete: Lembrete) => {
    // Block inactive users from editing lembretes
    if (!isUserActive()) {
      toast.error('Sua assinatura está inativa. Você não pode editar lembretes.');
      return;
    }
    
    console.log('Editing lembrete with ID:', lembrete.id);
    console.log('Editing lembrete:', lembrete);
    
    // Garantir que fazemos uma cópia profunda do objeto
    const lembreteCopy = JSON.parse(JSON.stringify(lembrete));
    setEditingLembrete(lembreteCopy);
    
    // Set form open after editing state is set
    setTimeout(() => {
      setIsFormOpen(true);
    }, 0);
  };

  const handleFormClose = () => {
    console.log('Form closed, cleaning up state');
    setIsFormOpen(false);
    // Limpar o lembrete em edição após um curto intervalo para evitar problemas de timing
    setTimeout(() => {
      setEditingLembrete(null);
    }, 100);
  };

  const handleFormSubmit = async (data: Lembrete) => {
    if (isProcessing) {
      console.log('Already processing a submission, ignoring');
      return;
    }
    
    try {
      console.log('Starting form submission processing');
      setIsProcessing(true);
      console.log('Form submitted with data:', data);
      
      // Atualizar a lista local primeiro com o novo lembrete
      if (editingLembrete?.id) {
        // Caso de edição - atualizar o item existente
        console.log('Updating local list with edited item');
        setLembretes(prevLembretes => 
          prevLembretes.map(item => 
            item.id === editingLembrete.id ? data : item
          )
        );
      } else {
        // Caso de adição - adicionar o novo item
        console.log('Adding new item to local list');
        if (data.id) {
          setLembretes(prevLembretes => [...prevLembretes, data]);
        }
      }
      
      // Trigger a reload via the submission counter
      console.log('Incrementing form submission counter to trigger reload');
      setFormSubmissionCount(prev => prev + 1);
      
      // Close form
      setIsFormOpen(false);
      
      // Clear editing state after form is closed
      setTimeout(() => {
        setEditingLembrete(null);
      }, 100);
      
    } catch (error) {
      console.error('Error updating lembretes list:', error);
      toast.error('Erro ao atualizar a lista de lembretes.');
    } finally {
      console.log('Form submission processing complete');
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: number) => {
    // Block inactive users from deleting lembretes
    if (!isUserActive()) {
      toast.error('Sua assinatura está inativa. Você não pode excluir lembretes.');
      return;
    }
    
    if (isProcessing) {
      console.log('Already processing an operation, ignoring delete');
      return;
    }
    
    try {
      console.log('Starting delete processing');
      setIsProcessing(true);
      console.log('Deleting lembrete with ID:', id);
      
      // Atualizar a lista local primeiro removendo o item
      setLembretes(prevLembretes => prevLembretes.filter(item => item.id !== id));
      
      // Deletar do servidor
      await deleteLembrete(id);
      toast.success('Lembrete excluído com sucesso');
      
      // Recarregar para sincronizar após um breve intervalo
      setTimeout(() => {
        loadLembretes();
      }, 100);
    } catch (error) {
      console.error('Error deleting lembrete:', error);
      toast.error('Erro ao excluir o lembrete. Tente novamente.');
      // Recarregar novamente em caso de erro
      loadLembretes();
    } finally {
      console.log('Delete processing complete');
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
