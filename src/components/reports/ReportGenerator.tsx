
import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ReportButton } from './ReportButton';
import { convertSvgsToImages, prepareReportData } from '@/lib/reports/reportUtils';
import { FileDown, Loader2 } from 'lucide-react';

interface ReportGeneratorProps {
  transactions: any[];
  monthlyData: any[];
  categoryData: any[];
  metasComProgresso: any[];
  dateRange: any;
  clientId?: string;
}

// Adicionar declaração de tipo para Window
declare global {
  interface Window {
    generateFinancialReport?: () => Promise<any>;
  }
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Função para gerar um relatório completo
  const generateFullReport = async () => {
    if (!chartsContainerRef.current) return;
    
    try {
      setIsGenerating(true);
      setHasError(false);
      toast.info("Gerando relatório, aguarde...", { id: "report-generation" });
      
      // Encontre todas as SVGs dentro do container de gráficos
      const svgElements = chartsContainerRef.current.querySelectorAll('svg');
      
      if (svgElements.length === 0) {
        toast.error("Não foi possível encontrar gráficos para exportar", { id: "report-generation" });
        setHasError(true);
        return null;
      }
      
      // Converta SVGs para imagens
      const images = await convertSvgsToImages(svgElements);
      
      if (images.length === 0) {
        toast.error("Falha ao converter gráficos para imagens", { id: "report-generation" });
        setHasError(true);
        return null;
      }
      
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
      toast.success("Relatório gerado com sucesso!", { id: "report-generation" });
      
      // Solução de fallback - exportar alguns dados como CSV se a exportação completa não estiver disponível
      if (window.generateFinancialReport) {
        // Esta função seria implementada para exportar o relatório completo
        await window.generateFinancialReport();
      } else {
        // Fallback - exportar CSV
        exportCSV();
      }
      
      return reportData;
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório. Tentando método alternativo...", { id: "report-generation" });
      
      // Tentativa de fallback - exportar CSV
      try {
        exportCSV();
        toast.success("Exportação básica concluída como CSV", { id: "report-generation" });
      } catch (csvError) {
        console.error("Erro na exportação CSV:", csvError);
        toast.error("Falha em todos os métodos de exportação", { id: "report-generation" });
        setHasError(true);
      }
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Função de fallback para exportar dados como CSV
  const exportCSV = () => {
    // Formatar transações como CSV
    const headers = ["Data", "Descrição", "Categoria", "Valor", "Tipo"];
    const csvRows = [
      headers.join(","),
      ...transactions.map(t => [
        t.data,
        `"${t.descricao?.replace(/"/g, '""') || ''}"`,
        `"${t.categoria?.replace(/"/g, '""') || ''}"`,
        t.valor,
        t.operação
      ].join(","))
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    
    // Criar link para download
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_financeiro_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Expor a função de geração de relatório na janela global para acesso externo
  React.useEffect(() => {
    // Definindo a função no escopo global
    window.generateFinancialReport = async () => {
      const reportData = await generateFullReport();
      return reportData;
    };
    
    return () => {
      // Limpar ao desmontar
      delete window.generateFinancialReport;
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
          <CardDescription>
            Gere um relatório completo com todos os gráficos e dados financeiros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <ReportButton 
              onClick={generateFullReport}
              className="w-full"
              variant="outline"
              size="sm"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando relatório...
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4 mr-2" />
                  Gerar Relatório Completo
                </>
              )}
            </ReportButton>
            
            {hasError && (
              <p className="text-xs text-red-500">
                Ocorreu um erro na geração do relatório completo. Tente a exportação CSV como alternativa.
              </p>
            )}
            
            <Button
              onClick={exportCSV}
              className="w-full mt-2"
              variant="secondary"
              size="sm"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Exportar dados como CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
