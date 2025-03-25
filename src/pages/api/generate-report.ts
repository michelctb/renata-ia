
import { generateReportApi } from '@/lib/reports/apiExample';

// Este é um handler API que será usado pela rota /api/generate-report
export default async function handler(req: any, res: any) {
  // Configurar cabeçalhos CORS para permitir acesso externo independente do método
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Verificar se a requisição é um OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Verificar se a requisição é um POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método não permitido" });
  }
  
  // Garantir que o Content-Type está definido como application/json
  res.setHeader('Content-Type', 'application/json');
  
  console.log("API generate-report chamada com método:", req.method);
  console.log("Headers:", JSON.stringify(req.headers));
  console.log("Body:", JSON.stringify(req.body));
  
  try {
    // Chamar a função de geração de relatório
    await generateReportApi(req, res);
  } catch (error: any) {
    console.error("Erro no handler da API:", error);
    
    return res.status(500).json({ 
      error: "Falha ao gerar relatório", 
      detalhes: error.message 
    });
  }
}
