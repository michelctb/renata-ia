
import { useState } from 'react';
import { toast } from 'sonner';
import { MetaCategoria, addMetaCategoria, updateMetaCategoria, deleteMetaCategoria } from '@/lib/metas';

interface UseMetasCRUDProps {
  userId: string | undefined;
  mesReferencia: number;
  anoReferencia: number;
  refreshMetas: () => Promise<void>;
  setMetas: React.Dispatch<React.SetStateAction<MetaCategoria[]>>;
}

/**
 * Hook responsável pelas operações de criar, atualizar e excluir metas
 */
export const useMetasCRUD = ({ 
  userId, 
  mesReferencia, 
  anoReferencia, 
  refreshMetas,
  setMetas 
}: UseMetasCRUDProps) => {
  
  /**
   * Função para salvar uma meta (nova ou atualizada)
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
   * Função para excluir uma meta
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
    handleSaveMeta,
    handleDeleteMeta
  };
};
