
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, UserCheck, LineChart } from 'lucide-react';
import { Cliente } from '@/lib/supabase/types';

interface UserStatsSummaryProps {
  clients: Cliente[];
}

export const UserStatsSummary = ({ clients }: UserStatsSummaryProps) => {
  const stats = useMemo(() => {
    // Total de usuários
    const totalUsers = clients.length;
    
    // Usuários ativos
    const activeUsers = clients.filter(client => client.ativo === true).length;
    
    // Percentual de atividade
    const activePercentage = totalUsers > 0 
      ? ((activeUsers / totalUsers) * 100).toFixed(1) 
      : 0;
    
    // Crescimento do último mês
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    const recentUsers = clients.filter(client => {
      const createdAt = client.created_at ? new Date(client.created_at) : null;
      return createdAt && createdAt >= oneMonthAgo;
    }).length;
    
    const growthRate = totalUsers > 0 
      ? ((recentUsers / totalUsers) * 100).toFixed(1) 
      : 0;
    
    // Distribuição por planos
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
    
    return {
      totalUsers,
      activeUsers,
      activePercentage,
      recentUsers,
      growthRate,
      topPlan
    };
  }, [clients]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total de Usuários */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activePercentage}% ativos no sistema
          </p>
        </CardContent>
      </Card>

      {/* Novos Usuários */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Novos Usuários (30 dias)</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.recentUsers}</div>
          <p className="text-xs text-muted-foreground">
            Taxa de crescimento: {stats.growthRate}%
          </p>
        </CardContent>
      </Card>

      {/* Usuários Ativos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activePercentage}% do total de usuários
          </p>
        </CardContent>
      </Card>

      {/* Plano Mais Popular */}
      <Card>
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
    </div>
  );
};
