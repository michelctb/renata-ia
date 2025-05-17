
/**
 * Utilitário para exportar gráficos como imagens
 */
import { COLORS } from "@/components/charts/hooks/useProcessPieChartData";
import { toast } from "sonner";

// Função para converter um elemento SVG para uma imagem PNG base64
export const svgToImage = async (
  svgElement: SVGElement,
  width: number = 800,
  height: number = 500
): Promise<string> => {
  try {
    // Clone o SVG para não afetar o original
    const clonedSvg = svgElement.cloneNode(true) as SVGElement;
    
    // Defina os atributos de tamanho
    clonedSvg.setAttribute("width", width.toString());
    clonedSvg.setAttribute("height", height.toString());
    
    // Defina viewBox se não existir
    if (!clonedSvg.getAttribute("viewBox")) {
      clonedSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }
    
    // Defina um fundo branco para garantir que o SVG não fique transparente
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", "white");
    clonedSvg.insertBefore(rect, clonedSvg.firstChild);
    
    // Converta para string SVG
    const svgString = new XMLSerializer().serializeToString(clonedSvg);
    const encodedSvg = encodeURIComponent(svgString);
    
    // Crie uma imagem a partir do SVG
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        try {
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
        } catch (error) {
          console.error("Erro ao processar canvas:", error);
          reject(error);
        }
      };
      
      img.onerror = (e) => {
        console.error("Erro ao carregar SVG como imagem:", e);
        reject(new Error("Failed to load SVG as image"));
      };
      
      // Use um data URI para carregar a imagem
      img.src = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
      
      // Defina um timeout para evitar travamentos
      setTimeout(() => {
        if (!img.complete) {
          reject(new Error("Image loading timed out"));
        }
      }, 5000);
    });
  } catch (error) {
    console.error("Erro na conversão de SVG para imagem:", error);
    throw error;
  }
};

// Método alternativo usando blob
export const svgToImageAlternative = async (
  svgElement: SVGElement,
  width: number = 800,
  height: number = 500
): Promise<string> => {
  try {
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgString], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png'));
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  } catch (error) {
    console.error("Erro no método alternativo de conversão:", error);
    throw error;
  }
};

// Função para extrair dados de metas em formato adequado para relatórios
export const formatMetasDataForReport = (metasComProgresso: any[]) => {
  if (!Array.isArray(metasComProgresso)) return [];
  
  return metasComProgresso.map(item => ({
    categoria: item.meta?.categoria || 'Não categorizado',
    valor_meta: item.meta?.valor_meta || 0,
    valor_atual: item.valor_atual || 0,
    porcentagem: Math.round((item.porcentagem || 0) * 100),
    status: item.status || 'pendente'
  }));
};

// Função para extrair dados de categorias em formato adequado para relatórios
export const formatCategoryDataForReport = (categoryData: any[]) => {
  if (!Array.isArray(categoryData)) return [];
  
  return categoryData.map((item, index) => ({
    categoria: item?.name || 'Não categorizado',
    valor: item?.value || 0,
    cor: COLORS[index % COLORS.length]
  }));
};
