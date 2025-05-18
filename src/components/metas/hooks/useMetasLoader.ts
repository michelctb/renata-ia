
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { MetaCategoria, fetchMetasPeriodo } from '@/lib/metas';

interface UseMetasLoaderProps {
  userId: string | undefined;
  mesReferencia: number;
  anoReferencia: number;
}

/**
 * Hook responsável por carregar as metas do usuário
 */
export const useMetasLoader = ({ userId, mesReferencia, anoReferencia }: UseMetasLoaderProps) => {
  const [metas, setMetas] = useState<MetaCategoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  // Carregar metas quando o componente montar ou quando o mês/ano mudar
  useEffect(() => {
    loadMetas();
  }, [loadMetas]);
  
  return {
    metas,
    setMetas,
    isLoading,
    refreshMetas: loadMetas
  };
};
