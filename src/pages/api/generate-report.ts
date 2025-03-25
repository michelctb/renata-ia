
import { generateReportApi } from '@/lib/reports/apiExample';

// Chave de API para autenticação
const API_KEY = "784ce4af-6987-4711-b5bd-920f1d67a8d4";

// Este é um handler API que será usado pela rota /api/generate-report
export default async function handler(req: any, res: any) {
  console.log("=== API GENERATE-REPORT HANDLER INICIADO ===");
  console.log("Método:", req.method);
  console.log("Headers:", JSON.stringify(req.headers));
  console.log("URL completa:", req.url);
  console.log("Body:", JSON.stringify(req.body || {}));
  
  // Configurar cabeçalhos CORS para permitir acesso externo independente do método
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  
  // Verificar se a requisição é um OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    console.log("Requisição OPTIONS detectada, retornando 200");
    return res.status(200).end();
  }
  
  // Verificar se a requisição é um POST ou GET (aceitamos ambos para facilitar testes)
  if (req.method !== 'POST' && req.method !== 'GET') {
    console.log("Método não permitido:", req.method);
    return res.status(405).json({ error: "Método não permitido" });
  }

  // Verificar a chave de API para requisições em produção
  const apiKey = req.headers['x-api-key'];
  if (req.method === 'POST' && apiKey !== API_KEY) {
    console.log("Chave de API inválida:", apiKey);
    return res.status(401).json({ error: "Chave de API inválida ou ausente" });
  }
  
  // Garantir que o Content-Type está definido como application/json
  res.setHeader('Content-Type', 'application/json');
  
  try {
    console.log("Método autorizado:", req.method);
    
    // Para GET, criamos dados de exemplo para teste
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
        images: []
      };
      
      console.log("Enviando resposta de teste:", JSON.stringify(testData).substring(0, 100) + "...");
      return res.status(200).json(testData);
    }
    
    // Para POST, verificamos o body e processamos normalmente
    console.log("Processando requisição POST");
    
    // Verificar se o body foi recebido e está no formato correto
    if (!req.body || typeof req.body !== 'object') {
      console.error("Body da requisição ausente ou inválido");
      return res.status(400).json({ 
        error: "Corpo da requisição inválido",
        receivedBody: req.body
      });
    }
    
    console.log("Body recebido:", JSON.stringify(req.body));
    
    // Chamar a função de geração de relatório
    return await generateReportApi(req, res);
  } catch (error: any) {
    console.error("Erro no handler da API:", error);
    
    return res.status(500).json({ 
      error: "Falha ao gerar relatório", 
      detalhes: error.message 
    });
  }
}
