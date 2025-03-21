
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  MetaCategoria, 
  fetchMetasCategorias, 
  addMetaCategoria, 
  updateMetaCategoria, 
  deleteMetaCategoria 
} from '@/lib/metas';

/**
 * Custom hook for managing metas data operations.
 * Handles fetching, creating, updating, and deleting metas.
 * 
 * @param {string | undefined} userId - The ID of the current user.
 * @returns {Object} Object containing metas data, loading state, and CRUD handlers.
 * @property {MetaCategoria[]} metas - The list of metas for the current user.
 * @property {boolean} isLoading - Whether the metas are currently being loaded.
 * @property {Function} handleSaveMeta - Function to save (create or update) a meta.
 * @property {Function} handleDeleteMeta - Function to delete a meta.
 */
export const useMetasData = (userId: string | undefined) => {
  const [metas, setMetas] = useState<MetaCategoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load metas from database
  useEffect(() => {
    const loadMetas = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const data = await fetchMetasCategorias(userId);
        console.log('Metas carregadas:', data);
        
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
    };
    
    loadMetas();
  }, [userId]);
  
  /**
   * Handles saving a meta (creates a new one or updates an existing one).
   * 
   * @param {MetaCategoria} meta - The meta to save.
   * @returns {Promise<void>}
   */
  const handleSaveMeta = async (meta: MetaCategoria) => {
    if (!userId) return;
    
    try {
      const metaToSave = {
        ...meta,
        id_cliente: userId
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
   * 
   * @param {number} id - The ID of the meta to delete.
   * @returns {Promise<void>}
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
  
  return {
    metas,
    isLoading,
    handleSaveMeta,
    handleDeleteMeta
  };
};
