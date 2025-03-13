
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchLembretes, Lembrete } from '@/lib/lembretes';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import LembreteForm from '@/components/lembretes/LembreteForm';
import LembretesList from '@/components/lembretes/LembretesList';

const LembretesTab = () => {
  const { user } = useAuth();
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLembrete, setEditingLembrete] = useState<Lembrete | null>(null);

  useEffect(() => {
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
    
    loadLembretes();
  }, [user]);

  const handleAddNew = () => {
    setEditingLembrete(null);
    setIsFormOpen(true);
  };

  const handleEdit = (lembrete: Lembrete) => {
    setEditingLembrete(lembrete);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingLembrete(null);
  };

  const handleFormSubmit = async (data: Lembrete) => {
    setLembretes(prevLembretes => {
      if (editingLembrete) {
        // Update existing lembrete
        return prevLembretes.map(item => 
          item.id === data.id ? data : item
        );
      } else {
        // Add new lembrete
        return [...prevLembretes, data];
      }
    });
    setIsFormOpen(false);
    setEditingLembrete(null);
  };

  const handleDelete = async (id: number) => {
    setLembretes(prevLembretes => prevLembretes.filter(item => item.id !== id));
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
        <Button onClick={handleAddNew}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Novo Lembrete
        </Button>
      </div>

      <LembretesList 
        lembretes={lembretes}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
