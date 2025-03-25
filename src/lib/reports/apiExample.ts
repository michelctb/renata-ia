
// Endpoint API para o n8n solicitar relatórios com gráficos
// Este é um exemplo que seria implementado no backend real

import { formatCategoryDataForReport } from './chartExport';

// Interface para o corpo da requisição
export interface ReportRequestBody {
  clientId: string;
  reportType: 'categorias' | 'metas' | 'completo';
  dateRange?: {
    from: string;
    to: string;
  };
  includeCharts: boolean;
}

// Função mock para simular geração de imagens base64
// Em um ambiente real, você usaria a função do seu componente ReportGenerator
const getMockChartImages = () => {
  // Em produção, isso viria dos gráficos reais renderizados
  // Aqui estamos apenas simulando com uma pequena imagem transparente de exemplo
  const mockBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  
  return [
    {
      name: "grafico_categorias.png",
      data: mockBase64
    },
    {
      name: "grafico_ranking.png",
      data: mockBase64
    }
  ];
};

// Função principal que o backend chamaria
export const generateReportApi = async (req: any, res: any) => {
  try {
    console.log("Iniciando generateReportApi");
    
    // Verificar se o Content-Type está correto
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      console.error("Content-Type incorreto:", contentType);
      return res.status(415).json({ error: "Content-Type deve ser application/json" });
    }
    
    // Extrair o corpo da requisição
    const requestBody = req.body;
    console.log("Corpo da requisição:", JSON.stringify(requestBody));
    
    // Verificar se o corpo está vazio ou mal formatado
    if (!requestBody || Object.keys(requestBody).length === 0) {
      console.error("Corpo da requisição vazio ou mal formatado");
      return res.status(400).json({ error: "Corpo da requisição inválido" });
    }
    
    const { clientId, reportType, dateRange, includeCharts } = requestBody as ReportRequestBody;
    
    console.log(`Gerando relatório do tipo ${reportType} para o cliente ${clientId}`);
    console.log(`Período: de ${dateRange?.from} até ${dateRange?.to}`);
    console.log(`Incluir gráficos: ${includeCharts}`);
    
    // Validar os parâmetros necessários
    if (!clientId || !reportType) {
      return res.status(400).json({ error: "clientId e reportType são obrigatórios" });
    }
    
    // Definir explicitamente o Content-Type da resposta como JSON
    res.setHeader('Content-Type', 'application/json');
    
    // Para garantir que retornamos JSON, vamos estruturar corretamente a resposta
    const reportData = {
      meta: {
        clientId,
        geradoEm: new Date().toISOString(),
        reportType,
        periodo: dateRange,
      },
      dados: {
        // Aqui viriam os dados extraídos do seu dashboard
        categorias: [
          { nome: "Alimentação", valor: 450.75 },
          { nome: "Transporte", valor: 300.25 },
          { nome: "Lazer", valor: 250.00 }
        ]
      },
      // Garantimos que as imagens estão em formato base64 correto
      images: includeCharts ? getMockChartImages() : []
    };
    
    console.log("Enviando resposta JSON");
    
    // Retornar os dados como JSON
    return res.status(200).json(reportData);
  } catch (error: any) {
    console.error("Erro ao gerar relatório via API:", error);
    return res.status(500).json({ 
      error: "Falha ao gerar relatório", 
      detalhes: error.message 
    });
  }
};

// COMANDO CURL CORRETO PARA TESTE:
/*
curl -X POST https://preview--renata-ia.lovable.app/api/generate-report 
  -H "Content-Type: application/json" 
  -d '{
    "clientId": "5cc683bb", 
    "reportType": "categorias",
    "dateRange": {
      "from": "2023-10-01T00:00:00.000Z",
      "to": "2023-10-07T23:59:59.999Z"
    },
    "includeCharts": true
  }'
*/

// EXEMPLO DE RESPOSTA CORRETA:
/*
{
  "meta": {
    "clientId": "5cc683bb",
    "geradoEm": "2023-10-08T15:45:23.456Z",
    "reportType": "categorias",
    "periodo": {
      "from": "2023-10-01T00:00:00.000Z",
      "to": "2023-10-07T23:59:59.999Z"
    }
  },
  "dados": {
    "categorias": [
      { "nome": "Alimentação", "valor": 450.75 },
      { "nome": "Transporte", "valor": 300.25 },
      { "nome": "Lazer", "valor": 250.00 }
    ]
  },
  "images": [
    {
      "name": "grafico_categorias.png",
      "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhE..."
    },
    {
      "name": "grafico_ranking.png",
      "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhE..."
    }
  ]
}
*/
