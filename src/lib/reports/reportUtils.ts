
import { toast } from 'sonner';
import { svgToImage } from './chartExport';
import { parseISO, format } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

// Importar as funções que estavam faltando
import { formatMetasDataForReport, formatCategoryDataForReport } from './chartExport';

const TIMEZONE = 'America/Sao_Paulo';

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
 * Formata datas ISO para o formato do relatório, considerando o fuso horário de São Paulo
 * @param isoDate - Data em formato ISO
 * @returns Data formatada para o relatório
 */
export const formatDateForReport = (isoDate: string | Date | null | undefined): string | null => {
  if (!isoDate) return null;
  
  try {
    const date = typeof isoDate === 'string' ? parseISO(isoDate) : isoDate;
    // Usar formatInTimeZone para garantir que a data seja formatada no fuso horário correto
    return formatInTimeZone(date, TIMEZONE, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Erro ao formatar data para relatório:', error);
    return null;
  }
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
    geradoEm: formatInTimeZone(new Date(), TIMEZONE, 'yyyy-MM-dd\'T\'HH:mm:ssXXX'),
    clientId: clientId || 'user-dashboard',
    periodo: dateRange ? {
      inicio: formatDateForReport(dateRange.from),
      fim: formatDateForReport(dateRange.to)
    } : null,
    totalTransacoes: transactions.length,
    metas: formatMetasDataForReport(metasComProgresso),
    categorias: formatCategoryDataForReport(categoryData),
    images
  };
};

// Re-exportando as funções existentes do chartExport
export { formatMetasDataForReport, formatCategoryDataForReport } from './chartExport';
