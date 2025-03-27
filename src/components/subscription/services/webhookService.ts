
import { CustomerFormValues } from "../customerFormSchema";
import { PlanType } from "@/pages/Subscription";

// Tipo para a resposta do webhook
export type WebhookResponse = {
  status: 'success' | 'error';
  message: string;
  redirectUrl?: string;
};

// Handle the webhook submission for all plans
export async function submitToWebhook(formData: CustomerFormValues, plan: PlanType): Promise<WebhookResponse> {
  // Determine webhook URL based on the plan
  let webhookUrl = "http://localhost:5678/webhook/renata-ia";
  
  // Use specific webhook URL for the teste plan
  if (plan === "teste") {
    webhookUrl = "https://n8n.renata-ia.com.br/webhook/teste-gratis";
  }
  
  const webhookData = {
    plano: plan,
    nome: formData.name,
    cpf: formData.cpfCnpj,
    email: formData.email,
    celular: formData.mobilePhone
  };
  
  console.log("Sending data to webhook:", webhookData);
  console.log("Using webhook URL:", webhookUrl);
  
  try {
    // For CORS-restricted requests, use fetch with mode: 'cors'
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      // Se a resposta não for ok, retornar erro
      const errorText = await response.text();
      console.error("Error from webhook:", errorText);
      return {
        status: 'error',
        message: errorText || 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.'
      };
    }
    
    // Tentar obter resposta como JSON
    try {
      const data = await response.json();
      console.log("Webhook response data:", data);
      
      // Verificar o formato da resposta do webhook
      if (Array.isArray(data) && data.length > 0) {
        const responseItem = data[0];
        
        // Caso 1: URL de redirecionamento
        if (responseItem.url) {
          return {
            status: 'success',
            message: 'Redirecionando para o checkout...',
            redirectUrl: responseItem.url
          };
        }
        
        // Caso 2: Mensagem de erro
        if (responseItem.erro) {
          return {
            status: 'error',
            message: responseItem.erro
          };
        }
        
        // Caso 3: Mensagem de sucesso
        if (responseItem.sucesso) {
          return {
            status: 'success',
            message: responseItem.sucesso
          };
        }
      }
      
      // Formato não reconhecido, tentar extrair informações do objeto
      if (data.redirectUrl || data.url) {
        return {
          status: 'success',
          message: data.message || 'Redirecionando para o checkout...',
          redirectUrl: data.redirectUrl || data.url
        };
      }
      
      // Verificar se há mensagem de erro explícita
      if (data.erro || data.error) {
        return {
          status: 'error',
          message: data.erro || data.error || 'Ocorreu um erro desconhecido'
        };
      }
      
      // Verificar se há mensagem de sucesso explícita
      if (data.sucesso || data.success) {
        return {
          status: 'success',
          message: data.sucesso || data.success || 'Operação concluída com sucesso!'
        };
      }
      
      // Fallback para formato desconhecido
      return {
        status: 'success',
        message: 'Operação concluída com sucesso!'
      };
      
    } catch (err) {
      // Se não for possível processar como JSON, tentar obter como texto
      const textResponse = await response.text();
      console.log("Webhook response text:", textResponse);
      
      // Verificar se o texto parece uma URL (começa com http)
      if (textResponse.trim().startsWith('http')) {
        return {
          status: 'success',
          message: 'Redirecionando para o checkout...',
          redirectUrl: textResponse.trim()
        };
      }
      
      // Caso contrário, retornar como mensagem de sucesso
      return {
        status: 'success',
        message: textResponse || 'Operação concluída com sucesso!'
      };
    }
  } catch (error) {
    console.error("Exception in webhook service:", error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Erro ao conectar com o serviço. Verifique sua conexão e tente novamente.'
    };
  }
}
