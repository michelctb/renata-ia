
import { toast } from 'sonner';
import { svgToImage } from './chartExport';

/**
 * Converte elementos SVG para imagens
 * @param svgElements - Lista de elementos SVG para converter
 * @returns Promise com as imagens convertidas
 */
export const convertSvgsToImages = async (svgElements: NodeListOf<Element>): Promise<Array<{name: string, data: string}>> => {
  if (svgElements.length === 0) {
    toast.error("Nenhum gráfico encontrado para exportar");
    return [];
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
  return Promise.all(imagePromises);
};

/**
 * Prepara os dados do relatório
 */
export const prepareReportData = (
  images: Array<{name: string, data: string}>,
  transactions: any[],
  metasComProgresso: any[],
  categoryData: any[],
  dateRange: any,
  clientId?: string
) => {
  return {
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
};

// Re-exportando as funções existentes do chartExport
export { formatMetasDataForReport, formatCategoryDataForReport } from './chartExport';
