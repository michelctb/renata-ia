
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart3, PieChart, FileBarChart, Download, FileText, AlertCircle } from 'lucide-react';
import { useClientData } from '@/hooks/useClientData';
import { subMonths } from 'date-fns';
import { toast } from 'sonner';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { DateRange } from 'react-day-picker';
import { useReportData } from '@/hooks/reports/useReportData';
import ReportFilters from './reports/ReportFilters';
import ReportSummary from './reports/ReportSummary';
import ReportDetailed from './reports/ReportDetailed';
import ReportCategories from './reports/ReportCategories';
import { useDateValidation } from '@/hooks/useDateValidation';

const ReportsTab: React.FC = () => {
  const { clients, isLoading: isLoadingClients } = useClientData();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('resumo');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subMonths(new Date(), 3),
    to: new Date()
  });
  
  const { isValidDateRange, getSafeDateRange } = useDateValidation();

  // Validar o intervalo de datas atual
  const validDateRange = isValidDateRange(dateRange) ? dateRange : getSafeDateRange(dateRange);

  // Usar o hook personalizado para gerenciar os dados do relatório
  const { 
    transactions, 
    monthlyData, 
    categoryData, 
    metasComProgresso,
    isLoading: isLoadingTransactions
  } = useReportData(selectedClient, validDateRange as DateRange);

  // Gerar relatório em formato tabular
  const generateTableReport = async () => {
    if (!transactions.length) {
      toast.error("Não há dados para gerar o relatório");
      return;
    }

    // Se a função estiver disponível no escopo global (implementada pelo ReportGenerator)
    if (typeof (window as any).generateFinancialReport === 'function') {
      try {
        await (window as any).generateFinancialReport();
      } catch (error) {
        console.error("Erro ao gerar relatório:", error);
        toast.error("Erro ao gerar relatório. Verifique o console para mais detalhes.");
      }
    } else {
      toast.error("Funcionalidade de geração de relatório não está disponível");
    }
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
          <ReportFilters 
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            selectedClient={selectedClient}
            onClientChange={setSelectedClient}
            clients={clients}
          />
          
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
                <ReportSummary transactions={transactions} monthlyData={monthlyData} />
              </TabsContent>
              
              <TabsContent value="detalhado" className="space-y-4">
                <ReportDetailed transactions={transactions} />
              </TabsContent>
              
              <TabsContent value="categorias" className="space-y-4">
                <ReportCategories transactions={transactions} categoryData={categoryData} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="mx-auto bg-muted/20 p-6 rounded-lg max-w-md border border-dashed">
                <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                {selectedClient ? (
                  <p>Não há transações para o período selecionado.</p>
                ) : (
                  <p>Selecione um cliente para visualizar os relatórios.</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Tente ajustar o intervalo de datas ou selecione outro cliente.
                </p>
              </div>
            </div>
          )}
          
          {transactions.length > 0 && (
            <div className="flex justify-end space-x-2">
              <Button
                onClick={generateTableReport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Gerar Tabela de Transações
              </Button>
              
              <Button
                onClick={generateTableReport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar Relatório Completo
              </Button>
            </div>
          )}
          
          {transactions.length > 0 && (
            <ReportGenerator 
              transactions={transactions}
              monthlyData={monthlyData}
              categoryData={categoryData}
              metasComProgresso={metasComProgresso}
              dateRange={validDateRange}
              clientId={selectedClient}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsTab;
