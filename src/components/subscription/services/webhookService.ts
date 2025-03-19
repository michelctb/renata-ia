
import { CustomerFormValues } from "../customerFormSchema";
import { PlanType } from "@/pages/Subscription";

// Handle the webhook submission for all plans
export async function submitToWebhook(formData: CustomerFormValues, plan: PlanType) {
  const webhookUrl = "http://localhost:5678/webhook-test/renata-ia";
  
  const webhookData = {
    plano: plan,
    nome: formData.name,
    cpf: formData.cpfCnpj,
    email: formData.email,
    celular: formData.mobilePhone
  };
  
  console.log("Sending data to webhook:", webhookData);
  
  // Send data to webhook
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(webhookData),
    // Don't follow redirects automatically
    redirect: "manual"
  });
  
  console.log("Webhook response status:", response.status);
  console.log("Webhook response type:", response.type);
  
  // Handle redirect response (status 302, 303, etc.)
  if (response.type === "opaqueredirect") {
    // For redirect responses, get the Location header
    const redirectUrl = response.headers.get("Location");
    console.log("Redirect URL from headers:", redirectUrl);
    
    if (redirectUrl) {
      return redirectUrl;
    } else {
      throw new Error("URL de redirecionamento não encontrada na resposta");
    }
  }
  
  // If not a redirect, try to parse JSON response (fallback to original behavior)
  if (response.ok) {
    try {
      const responseData = await response.json();
      console.log("Webhook response data:", responseData);
      
      // Extract the invoiceUrl from the response
      if (responseData && responseData.invoiceUrl) {
        return responseData.invoiceUrl;
      } else {
        console.error("No invoiceUrl found in response:", responseData);
        throw new Error("URL de checkout não encontrada na resposta");
      }
    } catch (error) {
      console.error("Error parsing response:", error);
      throw new Error("Erro ao processar resposta do webhook");
    }
  } else {
    throw new Error(`Erro ao enviar dados: ${response.statusText}`);
  }
}
