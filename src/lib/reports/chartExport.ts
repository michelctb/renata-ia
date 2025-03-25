
/**
 * Utilitário para exportar gráficos como imagens
 */
import { COLORS } from "@/components/charts/hooks/useProcessPieChartData";

// Função para converter um elemento SVG para uma imagem PNG base64
export const svgToImage = async (
  svgElement: SVGElement,
  width: number,
  height: number
): Promise<string> => {
  // Clone o SVG para não afetar o original
  const clonedSvg = svgElement.cloneNode(true) as SVGElement;
  
  // Defina os atributos de tamanho
  clonedSvg.setAttribute("width", width.toString());
  clonedSvg.setAttribute("height", height.toString());
  
  // Converta para string SVG
  const svgString = new XMLSerializer().serializeToString(clonedSvg);
  const encodedSvg = encodeURIComponent(svgString);
  
  // Crie uma imagem a partir do SVG
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Desenhe a imagem em um canvas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      
      // Defina um fundo branco
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      
      // Desenhe a imagem
      ctx.drawImage(img, 0, 0, width, height);
      
      // Converta para PNG base64
      const pngBase64 = canvas.toDataURL("image/png");
      resolve(pngBase64);
    };
    
    img.onerror = (e) => {
      reject(new Error("Failed to load SVG as image: " + e));
    };
    
    img.src = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
  });
};

// Função para extrair dados de metas em formato adequado para relatórios
export const formatMetasDataForReport = (metasComProgresso: any[]) => {
  return metasComProgresso.map(item => ({
    categoria: item.meta.categoria,
    valor_meta: item.meta.valor_meta,
    valor_atual: item.valor_atual,
    porcentagem: Math.round(item.porcentagem * 100),
    status: item.status
  }));
};

// Função para extrair dados de categorias em formato adequado para relatórios
export const formatCategoryDataForReport = (categoryData: any[]) => {
  return categoryData.map((item, index) => ({
    categoria: item.name,
    valor: item.value,
    cor: COLORS[index % COLORS.length]
  }));
};
