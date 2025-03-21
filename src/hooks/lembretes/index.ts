
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Lembrete, fetchLembretes, addLembrete, updateLembrete, deleteLembrete } from '@/lib/lembretes';
import { useAuth } from '@/contexts/AuthContext';

export function useLembretes() {
  const { user } = useAuth();
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const loadLembretes = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await fetchLembretes(user.id);
      setLembretes(data || []);
    } catch (error) {
      console.error('Error loading lembretes:', error);
      toast.error('Erro ao carregar lembretes');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  const handleAddLembrete = async (lembrete: Lembrete) => {
    if (!user?.id) return null;
    
    setIsSubmitting(true);
    try {
      lembrete.id_cliente = user.id;
      const newLembrete = await addLembrete(lembrete);
      setLembretes(prev => [newLembrete, ...prev]);
      toast.success('Lembrete adicionado com sucesso!');
      return newLembrete;
    } catch (error) {
      console.error('Error adding lembrete:', error);
      toast.error('Erro ao adicionar lembrete');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateLembrete = async (lembrete: Lembrete) => {
    if (!user?.id) return null;
    
    setIsSubmitting(true);
    try {
      const updatedLembrete = await updateLembrete(lembrete);
      setLembretes(prev => 
        prev.map(item => item.id === lembrete.id ? updatedLembrete : item)
      );
      toast.success('Lembrete atualizado com sucesso!');
      return updatedLembrete;
    } catch (error) {
      console.error('Error updating lembrete:', error);
      toast.error('Erro ao atualizar lembrete');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteLembrete = async (id: number) => {
    setIsDeleting(true);
    try {
      await deleteLembrete(id);
      setLembretes(prev => prev.filter(item => item.id !== id));
      toast.success('Lembrete excluído com sucesso!');
      return true;
    } catch (error) {
      console.error('Error deleting lembrete:', error);
      toast.error('Erro ao excluir lembrete');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };
  
  return {
    lembretes,
    isLoading,
    isDeleting,
    isSubmitting,
    loadLembretes,
    handleAddLembrete,
    handleUpdateLembrete,
    handleDeleteLembrete
  };
}
