
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart3, PieChart, FileBarChart, Download, Calendar } from 'lucide-react';
import { useClientData } from '@/hooks/useClientData';
import { fetchTransactions } from '@/lib/supabase/transactions';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import DateRangePicker from '@/components/DateRangePicker';
import { format, subMonths, isWithinInterval, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { DateRange } from 'react-day-picker';

// Função auxiliar para normalizar o tipo de operação
const normalizeOperationType = (operation: string): 'entrada' | 'saída' => {
  const normalized = operation.toLowerCase().trim();
  
  // Verificar variações de "entrada"
  if (normalized === 'entrada' || normalized === 'entrada' || normalized === 'receita') {
    return 'entrada';
  }
  
  // Verificar variações de "saída"
  if (normalized === 'saída' || normalized === 'saida' || normalized === 'despesa') {
    return 'saída';
  }
  
  // Valor padrão se não for reconhecido
  console.warn(`Tipo de operação não reconhecido: ${operation}, considerando como saída`);
  return 'saída';
};

const ReportsTab: React.FC = () => {
  const { clients, isLoading } = useClientData();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [activeTab, setActiveTab] = useState('resumo');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subMonths(new Date(), 3),
    to: new Date()
  });

  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setcategoryData] = useState<any[]>([]);
  const [metasComProgresso, setMetasComProgresso] = useState<any[]>([]);

  // Carregar dados de transações quando o cliente selecionado mudar
  useEffect(() => {
    const loadClientTransactions = async () => {
      if (!selectedClient) {
        setTransactions([]);
        return;
      }
      
      setIsLoadingTransactions(true);
      try {
        const data = await fetchTransactions(selectedClient);
        
        // Normalizar os tipos de operações antes de processar
        const normalizedData = data.map(transaction => ({
          ...transaction,
          operação: normalizeOperationType(transaction.operação || '')
        }));
        
        setTransactions(normalizedData);
        processTransactionData(normalizedData);
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
        toast.error("Não foi possível carregar as transações");
      } finally {
        setIsLoadingTransactions(false);
      }
    };
    
    loadClientTransactions();
  }, [selectedClient]);

  // Processar dados de transações para os relatórios
  const processTransactionData = (data: any[]) => {
    if (!data.length) return;
    
    // Filtrar por data range
    const filteredData = data.filter(transaction => {
      const transactionDate = new Date(transaction.data);
      return dateRange.from && dateRange.to && 
        isWithinInterval(transactionDate, {
          start: dateRange.from,
          end: dateRange.to
        });
    });

    // Processar dados mensais (receitas e despesas por mês)
    const monthlyDataMap = new Map();
    
    filteredData.forEach(item => {
      const date = new Date(item.data);
      const monthYear = format(date, 'MMM/yyyy', { locale: ptBR });
      
      if (!monthlyDataMap.has(monthYear)) {
        monthlyDataMap.set(monthYear, { month: monthYear, receitas: 0, despesas: 0 });
      }
      
      const monthData = monthlyDataMap.get(monthYear);
      if (item.operação === 'entrada') {
        monthData.receitas += Number(item.valor || 0);
      } else if (item.operação === 'saída') {
        monthData.despesas += Number(item.valor || 0);
      }
    });
    
    const processedMonthlyData = Array.from(monthlyDataMap.values())
      .sort((a, b) => {
        const monthA = a.month.split('/')[0];
        const yearA = a.month.split('/')[1];
        const monthB = b.month.split('/')[0];
        const yearB = b.month.split('/')[1];
        
        const dateA = new Date(`${yearA}-${getMonthNumberFromName(monthA)}-01`);
        const dateB = new Date(`${yearB}-${getMonthNumberFromName(monthB)}-01`);
        
        return dateA.getTime() - dateB.getTime();
      });
    
    setMonthlyData(processedMonthlyData);
    
    // Processar dados por categoria
    const categoryDataMap = new Map();
    
    filteredData.forEach(item => {
      if (item.operação === 'saída' && item.categoria) {
        if (!categoryDataMap.has(item.categoria)) {
          categoryDataMap.set(item.categoria, 0);
        }
        categoryDataMap.set(item.categoria, categoryDataMap.get(item.categoria) + Number(item.valor || 0));
      }
    });
    
    const processedCategoryData = Array.from(categoryDataMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    setcategoryData(processedCategoryData);
    
    // Dados simulados para metas (em um sistema real, buscaríamos do banco)
    setMetasComProgresso([
      { 
        meta: { categoria: 'Alimentação', valor_meta: 1000 },
        valor_atual: 500,
        porcentagem: 0.5,
        status: 'em_andamento'
      },
      { 
        meta: { categoria: 'Transporte', valor_meta: 500 },
        valor_atual: 450,
        porcentagem: 0.9,
        status: 'em_andamento'
      }
    ]);
  };
  
  // Função auxiliar para obter o número do mês a partir do nome abreviado
  const getMonthNumberFromName = (monthName: string): string => {
    const monthIndex = [
      'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 
      'jul', 'ago', 'set', 'out', 'nov', 'dez'
    ].findIndex(m => monthName.toLowerCase().startsWith(m)) + 1;
    
    return monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`;
  };

  // Atualizar processamento quando mudar o date range
  useEffect(() => {
    if (transactions.length > 0) {
      processTransactionData(transactions);
    }
  }, [dateRange]);

  // Gerar relatório em formato tabular
  const generateTableReport = () => {
    if (!transactions.length) {
      toast.error("Não há dados para gerar o relatório");
      return;
    }

    // Em uma implementação real, aqui enviaríamos os dados para um endpoint que geraria
    // um arquivo Excel ou PDF, ou usaríamos uma biblioteca como xlsx ou jspdf
    toast.success("Relatório gerado com sucesso!");
  };

  // Função para lidar com mudanças no intervalo de datas
  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Relatórios Financeiros</CardTitle>
            <CardDescription>
              Visualize relatórios consolidados de todos os usuários
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <PieChart className="h-6 w-6 text-primary" />
            <FileBarChart className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium mb-2 block">Selecione o período</label>
              <DateRangePicker 
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Selecione o cliente</label>
              <select 
                className="w-full rounded-md border border-gray-300 p-2 dark:bg-gray-800 dark:border-gray-600"
                value={selectedClient || ''}
                onChange={(e) => setSelectedClient(e.target.value || null)}
              >
                <option value="">Todos os clientes</option>
                {clients.map(client => (
                  <option key={client.id_cliente} value={client.id_cliente}>
                    {client.nome || client.id_cliente}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {isLoadingTransactions ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <span className="ml-3">Carregando dados...</span>
            </div>
          ) : transactions.length > 0 ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="resumo">Resumo</TabsTrigger>
                <TabsTrigger value="detalhado">Detalhado</TabsTrigger>
                <TabsTrigger value="categorias">Categorias</TabsTrigger>
              </TabsList>
              
              <TabsContent value="resumo" className="space-y-4">
                <h3 className="text-lg font-semibold">Resumo Financeiro</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Total de Receitas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600">
                        R$ {transactions
                          .filter(t => t.operação === 'entrada')
                          .reduce((sum, t) => sum + Number(t.valor || 0), 0)
                          .toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Total de Despesas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-red-600">
                        R$ {transactions
                          .filter(t => t.operação === 'saída')
                          .reduce((sum, t) => sum + Number(t.valor || 0), 0)
                          .toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Transações por Mês</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mês</TableHead>
                          <TableHead>Receitas</TableHead>
                          <TableHead>Despesas</TableHead>
                          <TableHead>Saldo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {monthlyData.map((month, i) => (
                          <TableRow key={i}>
                            <TableCell>{month.month}</TableCell>
                            <TableCell className="text-green-600">R$ {month.receitas.toFixed(2)}</TableCell>
                            <TableCell className="text-red-600">R$ {month.despesas.toFixed(2)}</TableCell>
                            <TableCell className={month.receitas - month.despesas >= 0 ? 'text-green-600' : 'text-red-600'}>
                              R$ {(month.receitas - month.despesas).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="detalhado" className="space-y-4">
                <h3 className="text-lg font-semibold">Relatório Detalhado</h3>
                <Card>
                  <CardContent className="p-0">
                    <div className="max-h-96 overflow-auto">
                      <Table>
                        <TableHeader className="sticky top-0 bg-white dark:bg-gray-800">
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Operação</TableHead>
                            <TableHead>Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions
                            .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                            .map((transaction) => (
                              <TableRow key={transaction.id}>
                                <TableCell>{format(new Date(transaction.data), 'dd/MM/yyyy')}</TableCell>
                                <TableCell>{transaction.descrição || '-'}</TableCell>
                                <TableCell>{transaction.categoria || '-'}</TableCell>
                                <TableCell>{transaction.operação === 'entrada' ? 'Receita' : 'Despesa'}</TableCell>
                                <TableCell className={transaction.operação === 'entrada' ? 'text-green-600' : 'text-red-600'}>
                                  R$ {Number(transaction.valor || 0).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="categorias" className="space-y-4">
                <h3 className="text-lg font-semibold">Análise por Categorias</h3>
                <Card>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Total Gasto</TableHead>
                          <TableHead>% do Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryData.map((category, i) => {
                          const totalGasto = transactions
                            .filter(t => t.operação === 'saída')
                            .reduce((sum, t) => sum + Number(t.valor || 0), 0);
                            
                          const percentagem = totalGasto > 0 
                            ? ((category.value / totalGasto) * 100).toFixed(1) 
                            : '0.0';
                            
                          return (
                            <TableRow key={i}>
                              <TableCell>{category.name}</TableCell>
                              <TableCell>R$ {category.value.toFixed(2)}</TableCell>
                              <TableCell>{percentagem}%</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-12">
              {selectedClient ? (
                <p>Não há transações para o período selecionado.</p>
              ) : (
                <p>Selecione um cliente para visualizar os relatórios.</p>
              )}
            </div>
          )}
          
          {transactions.length > 0 && (
            <div className="flex justify-end space-x-2">
              <Button
                onClick={generateTableReport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar Relatório
              </Button>
            </div>
          )}
          
          {transactions.length > 0 && (
            <ReportGenerator 
              transactions={transactions}
              monthlyData={monthlyData}
              categoryData={categoryData}
              metasComProgresso={metasComProgresso}
              dateRange={dateRange}
              clientId={selectedClient}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsTab;
