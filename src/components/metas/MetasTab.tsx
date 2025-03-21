
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';
import { format, parseISO, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/DateRangePicker';
import { Transaction } from '@/lib/supabase';
import { 
  MetaCategoria, 
  MetaProgresso, 
  LIMITE_BAIXO, 
  LIMITE_MEDIO, 
  LIMITE_ALTO,
  fetchMetasCategorias, 
  addMetaCategoria, 
  updateMetaCategoria, 
  deleteMetaCategoria 
} from '@/lib/metas';
import { MetasList } from './MetasList';

interface MetasTabProps {
  transactions: Transaction[];
  dateRange: DateRange | null;
  setDateRange: (dateRange: DateRange | null) => void;
}

export default function MetasTab({ transactions, dateRange, setDateRange }: MetasTabProps) {
  const { user } = useAuth();
  const [metas, setMetas] = useState<MetaCategoria[]>([]);
  const [metasProgresso, setMetasProgresso] = useState<MetaProgresso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [periodoFiltro, setPeriodoFiltro] = useState<string>('mensal');
  
  // Carregar metas do usuário
  useEffect(() => {
    const loadMetas = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const data = await fetchMetasCategorias(user.id);
        console.log('Metas carregadas:', data);
        setMetas(data);
      } catch (error) {
        console.error('Erro ao carregar metas:', error);
        toast.error('Erro ao carregar metas de gastos');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMetas();
  }, [user]);
  
  // Calcular progresso das metas baseado nas transações
  useEffect(() => {
    if (!metas.length || !transactions.length) {
      setMetasProgresso([]);
      return;
    }
    
    // Filtrar transações pelo intervalo de datas selecionado
    const filteredTransactions = dateRange?.from 
      ? transactions.filter(transaction => {
          try {
            const transactionDate = parseISO(transaction.data);
            if (dateRange.from && dateRange.to) {
              return isWithinInterval(transactionDate, { 
                start: dateRange.from, 
                end: dateRange.to 
              });
            }
            return transactionDate >= dateRange.from;
          } catch (error) {
            console.error('Erro ao processar data:', transaction.data);
            return false;
          }
        })
      : transactions;
    
    // Obter mês e ano atual ou do período selecionado
    const dataReferencia = dateRange?.from || new Date();
    const mesReferencia = dataReferencia.getMonth() + 1;
    const anoReferencia = dataReferencia.getFullYear();
    
    // Filtrar metas pelo período selecionado
    const metasFiltradas = metas.filter(meta => {
      if (meta.periodo === 'mensal') {
        return meta.mes_referencia === mesReferencia && meta.ano_referencia === anoReferencia;
      } else if (meta.periodo === 'anual') {
        return meta.ano_referencia === anoReferencia;
      } else if (meta.periodo === 'trimestral') {
        // Para trimestral, implementaremos uma lógica mais simples por enquanto
        return meta.ano_referencia === anoReferencia;
      }
      return false;
    });
    
    // Calcular progresso para cada meta
    const progresso = metasFiltradas.map(meta => {
      // Filtrar transações apenas de saída e da categoria específica
      const gastosPorCategoria = filteredTransactions
        .filter(t => 
          t.operação?.toLowerCase() === 'saída' && 
          t.categoria === meta.categoria
        )
        .reduce((total, t) => total + (t.valor || 0), 0);
      
      // Calcular porcentagem
      const porcentagem = meta.valor_meta > 0 ? gastosPorCategoria / meta.valor_meta : 0;
      
      // Determinar status baseado na porcentagem
      let status: 'baixo' | 'médio' | 'alto' | 'excedido' = 'baixo';
      if (porcentagem > LIMITE_ALTO) {
        status = 'excedido';
      } else if (porcentagem > LIMITE_MEDIO) {
        status = 'alto';
      } else if (porcentagem > LIMITE_BAIXO) {
        status = 'médio';
      }
      
      return {
        meta,
        valor_atual: gastosPorCategoria,
        porcentagem,
        status
      };
    });
    
    setMetasProgresso(progresso);
  }, [metas, transactions, dateRange]);
  
  // Manipuladores de eventos para as metas
  const handleSaveMeta = async (meta: MetaCategoria) => {
    if (!user) return;
    
    try {
      // Garantir que a meta tem o id_cliente
      const metaToSave = {
        ...meta,
        id_cliente: user.id
      };
      
      // Se já tem ID, atualizar, senão adicionar nova
      if (meta.id) {
        const updatedMeta = await updateMetaCategoria(metaToSave);
        // Atualizar o estado com a meta atualizada
        setMetas(prevMetas => prevMetas.map(m => m.id === meta.id ? updatedMeta : m));
        toast.success('Meta atualizada com sucesso');
      } else {
        const newMeta = await addMetaCategoria(metaToSave);
        // Adicionar nova meta ao estado
        setMetas(prevMetas => [...prevMetas, newMeta]);
        toast.success('Meta adicionada com sucesso');
      }
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      toast.error('Erro ao salvar meta. Tente novamente.');
    }
  };
  
  const handleDeleteMeta = async (id: number) => {
    try {
      await deleteMetaCategoria(id);
      // Remover a meta excluída do estado
      setMetas(prevMetas => prevMetas.filter(m => m.id !== id));
      toast.success('Meta excluída com sucesso');
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
      toast.error('Erro ao excluir meta. Tente novamente.');
    }
  };
  
  // Ajustar intervalo de datas com base no período selecionado
  const handleChangePeriodo = (periodo: string) => {
    setPeriodoFiltro(periodo);
    
    const hoje = new Date();
    
    if (periodo === 'mensal') {
      const inicioMes = startOfMonth(hoje);
      const fimMes = endOfMonth(hoje);
      setDateRange({ from: inicioMes, to: fimMes });
    } else if (periodo === 'anual') {
      const inicioAno = new Date(hoje.getFullYear(), 0, 1);
      const fimAno = new Date(hoje.getFullYear(), 11, 31);
      setDateRange({ from: inicioAno, to: fimAno });
    }
  };
  
  if (isLoading) {
    return (
      <div className="container px-4 py-8 max-w-7xl">
        <div className="animate-pulse text-lg text-center">Carregando metas...</div>
      </div>
    );
  }
  
  const periodoAtual = (() => {
    if (dateRange?.from) {
      if (periodoFiltro === 'mensal') {
        return format(dateRange.from, 'MMMM yyyy');
      } else if (periodoFiltro === 'anual') {
        return `Ano ${dateRange.from.getFullYear()}`;
      }
    }
    return format(new Date(), 'MMMM yyyy');
  })();

  return (
    <div className="space-y-6">
      {/* Cabeçalho e filtros */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Metas de Gastos</h2>
          <p className="text-muted-foreground">
            Acompanhe e gerencie suas metas de gastos por categoria.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={periodoFiltro} onValueChange={handleChangePeriodo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
              <SelectItem value="personalizado">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          
          <DateRangePicker 
            dateRange={dateRange} 
            onUpdate={setDateRange} 
          />
        </div>
      </div>
      
      {/* Card principal */}
      <Card className="bg-white/90 dark:bg-gray-800/90 border-none shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>Metas para {periodoAtual}</CardTitle>
          <CardDescription>
            Acompanhe o progresso das suas metas de gastos por categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MetasList 
            userId={user?.id || ''}
            metas={metasProgresso}
            onSaveMeta={handleSaveMeta}
            onDeleteMeta={handleDeleteMeta}
          />
        </CardContent>
      </Card>
    </div>
  );
}
