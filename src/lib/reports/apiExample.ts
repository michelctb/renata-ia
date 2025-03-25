
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
    const { clientId, reportType, dateRange, includeCharts } = req.body as ReportRequestBody;
    
    console.log(`Gerando relatório do tipo ${reportType} para o cliente ${clientId}`);
    
    // Aqui você executaria código no servidor para gerar o relatório
    // Em um ambiente real, isso seria feito por um serviço no backend que
    // teria acesso aos dados do cliente e geraria as imagens dos gráficos
    
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
        // Na implementação real, você usaria um banco de dados 
        // ou chamaria uma função que captura os dados dos gráficos
        categorias: [
          { nome: "Alimentação", valor: 450.75 },
          { nome: "Transporte", valor: 300.25 },
          { nome: "Lazer", valor: 250.00 }
        ]
      },
      // Garantimos que as imagens estão em formato base64 correto
      images: includeCharts ? getMockChartImages() : []
    };
    
    return res.status(200).json(reportData);
  } catch (error) {
    console.error("Erro ao gerar relatório via API:", error);
    return res.status(500).json({ error: "Falha ao gerar relatório" });
  }
};

// Exemplo de como seria o curl para chamar esta API
/*
curl -X POST https://seu-site.com/api/generate-report 
  -H "Content-Type: application/json" 
  -H "Authorization: Bearer seu_token_de_api" 
  -d '{
    "clientId": "123456", 
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
    "clientId": "123456",
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
