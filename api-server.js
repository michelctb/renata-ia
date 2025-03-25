
const express = require('express');
const cors = require('cors');
const { formatCategoryDataForReport } = require('./src/lib/reports/chartExport');

const app = express();
const PORT = process.env.PORT || 3001;

// Chave de API para autenticação
const API_KEY = "784ce4af-6987-4711-b5bd-920f1d67a8d4";

// Configurar middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// Logs para todas as requisições
app.use((req, res, next) => {
  console.log("=== API REQUEST RECEBIDA ===");
  console.log("Método:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", JSON.stringify(req.headers));
  console.log("Body:", JSON.stringify(req.body || {}));
  next();
});

// Função mock para simular geração de imagens base64
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

// Rota principal para geração de relatórios
app.all('/api/generate-report', async (req, res) => {
  try {
    // Lidar com solicitações OPTIONS (CORS preflight)
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Verificar métodos permitidos
    if (req.method !== 'POST' && req.method !== 'GET') {
      console.log("Método não permitido:", req.method);
      return res.status(405).json({ error: "Método não permitido" });
    }

    // Verificar a chave de API para requisições POST
    if (req.method === 'POST') {
      const apiKey = req.headers['x-api-key'];
      if (apiKey !== API_KEY) {
        console.log("Chave de API inválida:", apiKey);
        return res.status(401).json({ error: "Chave de API inválida ou ausente" });
      }
    }
    
    // Processar solicitação GET (teste)
    if (req.method === 'GET') {
      console.log("Processando requisição GET (modo teste)");
      
      // Criar dados de teste para facilitar a depuração
      const testData = {
        meta: {
          clientId: "test-client",
          geradoEm: new Date().toISOString(),
          reportType: "categorias",
          message: "Esta é uma resposta de TESTE da API. Use POST com a chave API correta para dados reais."
        },
        dados: {
          categorias: [
            { nome: "Exemplo", valor: 100.00 }
          ]
        },
        images: getMockChartImages()
      };
      
      console.log("Enviando resposta de teste:", JSON.stringify(testData).substring(0, 100) + "...");
      return res.status(200).json(testData);
    }
    
    // Processar solicitação POST
    console.log("Processando requisição POST");
    
    // Verificar se o body foi recebido e está no formato correto
    if (!req.body || typeof req.body !== 'object') {
      console.error("Body da requisição ausente ou inválido");
      return res.status(400).json({ 
        error: "Corpo da requisição inválido",
        receivedBody: req.body
      });
    }
    
    // Extrair os dados da requisição
    const { clientId, reportType, dateRange, includeCharts } = req.body;
    
    console.log(`Gerando relatório do tipo ${reportType} para o cliente ${clientId}`);
    if (dateRange) {
      console.log(`Período: de ${dateRange.from} até ${dateRange.to}`);
    }
    console.log(`Incluir gráficos: ${includeCharts}`);
    
    // Validar os parâmetros necessários
    if (!clientId || !reportType) {
      return res.status(400).json({ error: "clientId e reportType são obrigatórios" });
    }
    
    // Estruturar a resposta
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
    
    console.log("Enviando resposta JSON:", JSON.stringify(reportData).substring(0, 200) + "...");
    return res.status(200).json(reportData);
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return res.status(500).json({ 
      error: "Falha ao gerar relatório", 
      detalhes: error.message 
    });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor API rodando na porta ${PORT}`);
  console.log(`Teste a API em: http://localhost:${PORT}/api/generate-report`);
});
