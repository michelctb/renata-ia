
import { generateReportApi } from '@/lib/reports/apiExample';

// Este é um handler API que será usado pela rota /api/generate-report
export default async function handler(req: any, res: any) {
  // Verificar se a requisição é um OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    // Configurar cabeçalhos CORS para permitir acesso externo
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }
  
  // Verificar se a requisição é um POST
  if (req.method !== 'POST') {
    // Configurar cabeçalhos CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(405).json({ error: "Método não permitido" });
  }
  
  try {
    // Chamar a função de geração de relatório
    console.log("API generate-report chamada:", JSON.stringify(req.body));
    await generateReportApi(req, res);
  } catch (error: any) {
    console.error("Erro no handler da API:", error);
    
    // Configurar cabeçalhos CORS mesmo em caso de erro
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return res.status(500).json({ 
      error: "Falha ao gerar relatório", 
      detalhes: error.message 
    });
  }
}
