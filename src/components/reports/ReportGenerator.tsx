
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ReportButton } from './ReportButton';
import { convertSvgsToImages, prepareReportData } from '@/lib/reports/reportUtils';

interface ReportGeneratorProps {
  transactions: any[];
  monthlyData: any[];
  categoryData: any[];
  metasComProgresso: any[];
  dateRange: any;
  clientId?: string;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  transactions,
  monthlyData,
  categoryData,
  metasComProgresso,
  dateRange,
  clientId
}) => {
  const chartsContainerRef = useRef<HTMLDivElement>(null);
  
  // Função para gerar um relatório completo
  const generateFullReport = async () => {
    if (!chartsContainerRef.current) return;
    
    try {
      toast.info("Gerando relatório...", { duration: 2000 });
      
      // Encontre todas as SVGs dentro do container de gráficos
      const svgElements = chartsContainerRef.current.querySelectorAll('svg');
      const images = await convertSvgsToImages(svgElements);
      
      if (images.length === 0) return;
      
      // Dados adicionais para o relatório
      const reportData = prepareReportData(
        images,
        transactions,
        metasComProgresso,
        categoryData,
        dateRange,
        clientId
      );
      
      console.log("Dados do relatório prontos para envio:", reportData);
      toast.success("Relatório gerado com sucesso!");
      
      return reportData;
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório");
      return null;
    }
  };
  
  // Expor a função de geração de relatório na janela global para acesso externo
  React.useEffect(() => {
    // Typescript: adicionando as propriedades ao objeto window
    (window as any).generateFinancialReport = async () => {
      const reportData = await generateFullReport();
      return reportData;
    };
    
    return () => {
      // Limpar ao desmontar
      delete (window as any).generateFinancialReport;
    };
  }, [categoryData, metasComProgresso, transactions, dateRange]);
  
  // Se não houver transações, não renderize o componente
  if (transactions.length === 0) {
    return null;
  }
  
  return (
    <div ref={chartsContainerRef}>
      <Card className="mt-4 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Exportar Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportButton 
            onClick={generateFullReport}
            className="w-full"
            variant="outline"
            size="sm"
          >
            Gerar Relatório Completo
          </ReportButton>
        </CardContent>
      </Card>
    </div>
  );
};
