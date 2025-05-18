
import { useMetasLoader } from './useMetasLoader';
import { useMetasCRUD } from './useMetasCRUD';

interface UseMetasDataProps {
  userId: string | undefined;
  mesReferencia: number;
  anoReferencia: number;
}

/**
 * Hook principal para gerenciar operações de metas.
 * Compõe hooks menores para separar responsabilidades.
 */
export const useMetasData = ({ userId, mesReferencia, anoReferencia }: UseMetasDataProps) => {
  // Carregar metas
  const { metas, setMetas, isLoading, refreshMetas } = useMetasLoader({
    userId,
    mesReferencia,
    anoReferencia
  });
  
  // Operações CRUD
  const { handleSaveMeta, handleDeleteMeta } = useMetasCRUD({
    userId,
    mesReferencia,
    anoReferencia,
    refreshMetas,
    setMetas
  });
  
  return {
    metas,
    isLoading,
    handleSaveMeta,
    handleDeleteMeta,
    refreshMetas
  };
};
