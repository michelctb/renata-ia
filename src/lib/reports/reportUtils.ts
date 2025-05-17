
import { toast } from 'sonner';
import { svgToImage, svgToImageAlternative } from './chartExport';
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
  
  // Lista de promessas para converter cada SVG para imagem
  const imagePromises = Array.from(svgElements).map((svg, index) => {
    return svgToImage(svg as SVGElement, 800, 500)
      .catch((error) => {
        console.error(`Falha no método primário de conversão para o gráfico ${index + 1}:`, error);
        
        // Tentar o método alternativo
        return svgToImageAlternative(svg as SVGElement, 800, 500);
      })
      .then(base64 => ({
        name: `grafico_${index + 1}.png`,
        data: base64
      }))
      .catch((error) => {
        console.error(`Falha em ambos os métodos de conversão para o gráfico ${index + 1}:`, error);
        // Retornar um objeto vazio para não quebrar o Promise.all
        return {
          name: `grafico_${index + 1}_error.png`,
          data: '',
          error: true
        };
      });
  });
  
  // Aguarde todas as conversões
  const results = await Promise.all(imagePromises);
  
  // Filtre possíveis erros
  const validImages = results.filter(img => !img.error && img.data);
  
  if (validImages.length === 0 && svgElements.length > 0) {
    toast.error("Falha ao converter gráficos para imagens");
  } else if (validImages.length < svgElements.length) {
    toast.warning(`Apenas ${validImages.length} de ${svgElements.length} gráficos foram convertidos`);
  }
  
  return validImages;
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
    
    // Verificar se é uma data válida
    if (isNaN(date.getTime())) {
      console.warn('Data inválida:', isoDate);
      return null;
    }
    
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
  // Garantir que dateRange tenha valores válidos
  const validDateRange = dateRange && (dateRange.from || dateRange.to) ? {
    inicio: dateRange.from ? formatDateForReport(dateRange.from) : null,
    fim: dateRange.to ? formatDateForReport(dateRange.to) : null
  } : null;
  
  return {
    geradoEm: formatInTimeZone(new Date(), TIMEZONE, 'yyyy-MM-dd\'T\'HH:mm:ssXXX'),
    clientId: clientId || 'user-dashboard',
    periodo: validDateRange,
    totalTransacoes: Array.isArray(transactions) ? transactions.length : 0,
    resumoFinanceiro: {
      totalEntradas: Array.isArray(transactions) 
        ? transactions.filter(t => t.operação === 'entrada').reduce((acc, t) => acc + Number(t.valor || 0), 0) 
        : 0,
      totalSaidas: Array.isArray(transactions) 
        ? transactions.filter(t => t.operação === 'saída').reduce((acc, t) => acc + Number(t.valor || 0), 0) 
        : 0
    },
    metas: formatMetasDataForReport(metasComProgresso),
    categorias: formatCategoryDataForReport(categoryData),
    images
  };
};

// Re-exportando as funções existentes do chartExport
export { formatMetasDataForReport, formatCategoryDataForReport } from './chartExport';
