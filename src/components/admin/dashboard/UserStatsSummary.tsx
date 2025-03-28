
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, UserCheck, LineChart, CreditCard } from 'lucide-react';
import { Cliente } from '@/lib/supabase/types';
import { formatCurrency } from '@/lib/utils';
import { parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface UserStatsSummaryProps {
  clients: Cliente[];
  viewMode?: 'admin' | 'consultor';
}

export const UserStatsSummary = ({ clients, viewMode = 'admin' }: UserStatsSummaryProps) => {
  const stats = useMemo(() => {
    // Data atual para cálculos do mês corrente
    const today = new Date();
    const currentMonthStart = startOfMonth(today);
    const currentMonthEnd = endOfMonth(today);

    // Total de usuários
    const totalUsers = clients.length;
    
    // Usuários ativos
    const activeUsers = clients.filter(client => client.ativo === true).length;
    
    // Percentual de atividade
    const activePercentage = totalUsers > 0 
      ? ((activeUsers / totalUsers) * 100).toFixed(1) 
      : 0;
    
    // Crescimento do último mês
    const recentUsers = clients.filter(client => {
      if (!client.created_at) return false;
      
      try {
        const createdDate = parseISO(client.created_at);
        
        // Verificar se o cliente foi criado no mês atual
        return isWithinInterval(createdDate, {
          start: currentMonthStart,
          end: currentMonthEnd
        });
      } catch (error) {
        console.error('Erro ao processar data de criação:', error);
        return false;
      }
    }).length;
    
    const growthRate = totalUsers > 0 
      ? ((recentUsers / totalUsers) * 100).toFixed(1) 
      : 0;
    
    // Distribuição por planos (apenas para admin)
    const planCounts: Record<string, number> = {};
    clients.forEach(client => {
      const plan = client.plano || 'Sem plano';
      planCounts[plan] = (planCounts[plan] || 0) + 1;
    });
    
    const topPlan = Object.entries(planCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([plan, count]) => ({
        plan,
        count,
        percentage: ((count / totalUsers) * 100).toFixed(1)
      }))[0] || { plan: 'Nenhum', count: 0, percentage: '0' };
    
    // Cálculos financeiros para diferentes tipos de usuários (admin vs consultor)
    let monthlyRecurrence = 0;
    let currentMonthAdesao = 0;
    
    if (viewMode === 'admin') {
      // Para administradores: usar o campo 'valor'
      monthlyRecurrence = clients
        .filter(client => client.ativo === true)
        .reduce((sum, client) => sum + (client.valor || 0), 0);
    } else {
      // Para consultores: usar os campos 'recorrencia' e 'adesao'
      monthlyRecurrence = clients
        .filter(client => client.ativo === true)
        .reduce((sum, client) => sum + (client.recorrencia || 0), 0);
        
      // Calcular adesões do mês atual
      currentMonthAdesao = clients.reduce((sum, client) => {
        if (!client.created_at) return sum;
        
        try {
          const createdDate = parseISO(client.created_at);
          
          // Verificar se o cliente foi criado no mês atual
          if (isWithinInterval(createdDate, {
            start: currentMonthStart,
            end: currentMonthEnd
          })) {
            return sum + (client.adesao || 0);
          }
        } catch (error) {
          console.error('Erro ao processar data de criação:', error);
        }
        
        return sum;
      }, 0);
    }
      
    return {
      totalUsers,
      activeUsers,
      activePercentage,
      recentUsers,
      growthRate,
      topPlan,
      monthlyRecurrence,
      currentMonthAdesao,
      totalMonthlyRevenue: monthlyRecurrence + currentMonthAdesao
    };
  }, [clients, viewMode]);
  
  // Determina o número de colunas com base no modo de visualização
  // Usando grid-cols-5 de forma consistente para melhor preenchimento da tela
  const gridCols = 'md:grid-cols-2 lg:grid-cols-5';

  // Definir os termos baseado no viewMode
  const terms = viewMode === 'admin' 
    ? { users: 'Usuários', newUsers: 'Novos Usuários', activeUsers: 'Usuários Ativos' }
    : { users: 'Clientes', newUsers: 'Novos Clientes', activeUsers: 'Clientes Ativos' };

  return (
    <div className={`grid gap-4 grid-cols-1 ${gridCols}`}>
      {/* Total de Usuários/Clientes */}
      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de {terms.users}</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activePercentage}% ativos no sistema
          </p>
        </CardContent>
      </Card>

      {/* Novos Usuários/Clientes */}
      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{terms.newUsers} (30 dias)</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.recentUsers}</div>
          <p className="text-xs text-muted-foreground">
            Taxa de crescimento: {stats.growthRate}%
          </p>
        </CardContent>
      </Card>

      {/* Usuários/Clientes Ativos */}
      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{terms.activeUsers}</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activePercentage}% do total de {terms.users.toLowerCase()}
          </p>
        </CardContent>
      </Card>

      {/* Apenas para administradores: Plano Mais Popular */}
      {viewMode === 'admin' && (
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plano Mais Popular</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topPlan.plan}</div>
            <p className="text-xs text-muted-foreground">
              {stats.topPlan.count} usuários ({stats.topPlan.percentage}%)
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Para ambos os tipos: Recorrência/Faturamento Mensal */}
      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {viewMode === 'admin' ? 'Recorrência Mensal' : 'Faturamento do Mês'}
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-income">
            {viewMode === 'admin' 
              ? formatCurrency(stats.monthlyRecurrence)
              : formatCurrency(stats.totalMonthlyRevenue)}
          </div>
          <p className="text-xs text-muted-foreground">
            {viewMode === 'admin'
              ? 'Previsão de faturamento'
              : `Inclui ${formatCurrency(stats.currentMonthAdesao)} em adesões`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
