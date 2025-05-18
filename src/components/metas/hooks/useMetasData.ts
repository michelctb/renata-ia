
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  MetaCategoria, 
  fetchMetasPeriodo, 
  addMetaCategoria, 
  updateMetaCategoria, 
  deleteMetaCategoria 
} from '@/lib/metas';

interface UseMetasDataProps {
  userId: string | undefined;
  mesReferencia: number;
  anoReferencia: number;
}

/**
 * Custom hook for managing metas data operations.
 * Handles fetching, creating, updating, and deleting metas.
 */
export const useMetasData = ({ userId, mesReferencia, anoReferencia }: UseMetasDataProps) => {
  const [metas, setMetas] = useState<MetaCategoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load metas from database
  const loadMetas = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // Buscar metas do mês e ano atual
      const data = await fetchMetasPeriodo(
        userId, 
        'mensal',
        mesReferencia, 
        anoReferencia
      );
      
      const metasProcessadas: MetaCategoria[] = data.map(meta => ({
        ...meta,
        periodo: meta.periodo as 'mensal' | 'trimestral' | 'anual'
      }));
      
      setMetas(metasProcessadas);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      toast.error('Erro ao carregar metas de gastos');
    } finally {
      setIsLoading(false);
    }
  }, [userId, mesReferencia, anoReferencia]);
  
  // Load metas on component mount or when month/year changes
  useEffect(() => {
    loadMetas();
  }, [loadMetas]);
  
  /**
   * Handles saving a meta (creates a new one or updates an existing one).
   */
  const handleSaveMeta = async (meta: MetaCategoria) => {
    if (!userId) return;
    
    try {
      const metaToSave = {
        ...meta,
        id_cliente: userId,
        // Garantir que o período seja sempre mensal
        periodo: 'mensal',
        // Adicionar mês e ano da seleção atual
        mes_referencia: mesReferencia,
        ano_referencia: anoReferencia
      };
      
      if (meta.id) {
        const updatedMeta = await updateMetaCategoria(metaToSave);
        
        const metaProcessada: MetaCategoria = {
          ...updatedMeta,
          periodo: updatedMeta.periodo as 'mensal' | 'trimestral' | 'anual'
        };
        
        setMetas(prevMetas => prevMetas.map(m => m.id === meta.id ? metaProcessada : m));
        toast.success('Meta atualizada com sucesso');
      } else {
        const newMeta = await addMetaCategoria(metaToSave);
        
        const metaProcessada: MetaCategoria = {
          ...newMeta,
          periodo: newMeta.periodo as 'mensal' | 'trimestral' | 'anual'
        };
        
        setMetas(prevMetas => [...prevMetas, metaProcessada]);
        toast.success('Meta adicionada com sucesso');
      }
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      toast.error('Erro ao salvar meta. Tente novamente.');
    }
  };
  
  /**
   * Handles deleting a meta.
   */
  const handleDeleteMeta = async (id: number) => {
    try {
      await deleteMetaCategoria(id);
      setMetas(prevMetas => prevMetas.filter(m => m.id !== id));
      toast.success('Meta excluída com sucesso');
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
      toast.error('Erro ao excluir meta. Tente novamente.');
    }
  };
  
  /**
   * Refreshes the metas list.
   */
  const refreshMetas = useCallback(() => {
    loadMetas();
  }, [loadMetas]);
  
  return {
    metas,
    isLoading,
    handleSaveMeta,
    handleDeleteMeta,
    refreshMetas
  };
};
