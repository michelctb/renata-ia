
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { svgToImage, formatMetasDataForReport, formatCategoryDataForReport } from '@/lib/reports/chartExport';
import { toast } from 'sonner';

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
      
      if (svgElements.length === 0) {
        toast.error("Nenhum gráfico encontrado para exportar");
        return;
      }
      
      // Liste de promessas para converter cada SVG para imagem
      const imagePromises = Array.from(svgElements).map((svg, index) => 
        svgToImage(svg as SVGElement, 800, 500)
          .then(base64 => ({
            name: `grafico_${index + 1}.png`,
            data: base64
          }))
      );
      
      // Aguarde todas as conversões
      const images = await Promise.all(imagePromises);
      
      // Dados adicionais para o relatório
      const reportData = {
        geradoEm: new Date().toISOString(),
        clientId: clientId || 'user-dashboard',
        periodo: dateRange ? {
          inicio: dateRange.from?.toISOString(),
          fim: dateRange.to?.toISOString()
        } : null,
        totalTransacoes: transactions.length,
        metas: formatMetasDataForReport(metasComProgresso),
        categorias: formatCategoryDataForReport(categoryData),
        images
      };
      
      // Aqui você pode enviar os dados para sua API ou webhook
      console.log("Dados do relatório prontos para envio:", reportData);
      
      // Simulando o envio para a API
      toast.success("Relatório gerado com sucesso!");
      
      return reportData;
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório");
    }
  };
  
  // Expor a função de geração de relatório na janela global para acesso externo
  useEffect(() => {
    // Typescript: adicionando a propriedade ao objeto window
    (window as any).generateFinancialReport = async () => {
      const reportData = await generateFullReport();
      return reportData;
    };
    
    return () => {
      // Limpar ao desmontar
      delete (window as any).generateFinancialReport;
    };
  }, [categoryData, metasComProgresso, transactions, dateRange]);
  
  return (
    <div ref={chartsContainerRef}>
      {/* Este componente atua como um wrapper para os gráficos que serão exportados */}
      <Card className="mt-4 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Exportar Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={generateFullReport}
            className="w-full"
            variant="outline"
            size="sm"
          >
            Gerar Relatório Completo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
