
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TrendData {
  mes: number;
  ano: number;
  receitas: number;
  despesas: number;
  balanco: number;
}

export function useTrendsData(userId: string | null, meses: number = 3) {
  const [trendsData, setTrendsData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setTrendsData([]);
      setIsLoading(false);
      return;
    }

    const loadTrendsData = async () => {
      try {
        setIsLoading(true);
        
        // Buscar dados históricos primeiro
        const { data: historicalData, error: historicalError } = await supabase
          .from('financas_historicas')
          .select('*')
          .eq('user_id', userId)
          .eq('tipo', 'real')
          .order('ano', { ascending: false })
          .order('mes', { ascending: false })
          .limit(meses);

        if (historicalError) throw historicalError;

        // Se não houver dados históricos suficientes, inserir dados com base nas transações recentes
        if (!historicalData || historicalData.length < meses) {
          await populateHistoricalData(userId);
        }

        // Chamar a função do banco de dados para calcular tendências
        const { data: trends, error: trendsError } = await supabase
          .rpc('calcular_tendencia_financeira', {
            p_user_id: userId,
            p_meses: meses
          });

        if (trendsError) throw trendsError;
        
        setTrendsData(trends || []);
      } catch (err) {
        console.error('Erro ao carregar tendências:', err);
        setError(err instanceof Error ? err : new Error('Erro ao carregar tendências'));
        toast.error('Não foi possível carregar os dados de tendências');
      } finally {
        setIsLoading(false);
      }
    };

    loadTrendsData();
  }, [userId, meses]);

  // Função auxiliar para popular dados históricos a partir das transações
  async function populateHistoricalData(userId: string) {
    try {
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // Janeiro é 0
      const currentYear = today.getFullYear();

      // Buscar transações dos últimos 3 meses
      const { data: transactions } = await supabase
        .from('Sistema Financeiro')
        .select('*')
        .eq('id_cliente', userId);

      if (!transactions || transactions.length === 0) return;

      // Agrupar por mês e tipo
      const monthlyData: Record<string, { receitas: number, despesas: number }> = {};
      
      transactions.forEach(transaction => {
        if (!transaction.data) return;
        
        const date = new Date(transaction.data);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const key = `${year}-${month}`;
        
        if (!monthlyData[key]) {
          monthlyData[key] = { receitas: 0, despesas: 0 };
        }
        
        const amount = Number(transaction.valor || 0);
        if (transaction.operação === 'entrada') {
          monthlyData[key].receitas += amount;
        } else if (transaction.operação === 'saída') {
          monthlyData[key].despesas += amount;
        }
      });
      
      // Inserir dados no banco
      const entries = Object.entries(monthlyData).map(([key, data]) => {
        const [year, month] = key.split('-').map(Number);
        return {
          user_id: userId,
          ano: year,
          mes: month,
          tipo: 'real',
          receitas: data.receitas,
          despesas: data.despesas
        };
      });
      
      // Inserir apenas se não existir
      for (const entry of entries) {
        const { count } = await supabase
          .from('financas_historicas')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('ano', entry.ano)
          .eq('mes', entry.mes)
          .eq('tipo', 'real');
        
        if (count === 0) {
          await supabase.from('financas_historicas').insert(entry);
        }
      }
    } catch (err) {
      console.error('Erro ao popular dados históricos:', err);
    }
  }

  return { trendsData, isLoading, error };
}
