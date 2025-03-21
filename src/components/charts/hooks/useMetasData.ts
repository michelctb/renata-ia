
import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { MetaCategoria, fetchMetasPeriodo } from '@/lib/metas';
import { useAuth } from '@/contexts/AuthContext';

export function useMetasData(
  dateRange: DateRange | undefined | null,
  clientId?: string,
  viewMode: 'user' | 'admin' | 'consultor' = 'user'
) {
  const { user } = useAuth();
  const [metas, setMetas] = useState<MetaCategoria[]>([]);
  
  // Buscar metas para o período atual
  useEffect(() => {
    const loadMetas = async () => {
      if (!dateRange?.from) return;
      
      try {
        const userId = viewMode === 'consultor' && clientId ? clientId : user?.id;
        
        if (!userId) return;
        
        const mesReferencia = dateRange.from.getMonth() + 1;
        const anoReferencia = dateRange.from.getFullYear();
        
        const metasPeriodo = await fetchMetasPeriodo(
          userId, 
          'mensal', 
          mesReferencia, 
          anoReferencia
        );
        
        // Converter explicitamente para o tipo correto
        const metasProcessadas: MetaCategoria[] = metasPeriodo.map(meta => ({
          ...meta,
          periodo: meta.periodo as 'mensal' | 'trimestral' | 'anual' | string
        }));
        
        setMetas(metasProcessadas);
      } catch (error) {
        console.error('Erro ao carregar metas para dashboard:', error);
      }
    };
    
    loadMetas();
  }, [user, dateRange, clientId, viewMode]);
  
  return metas;
}
