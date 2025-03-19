
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
  });
  
  if (!response.ok) {
    throw new Error(`Erro ao enviar dados: ${response.statusText}`);
  }
  
  const responseData = await response.json();
  console.log("Webhook response data:", responseData);
  
  // Extract the invoiceUrl from the response
  if (responseData && responseData.invoiceUrl) {
    return responseData.invoiceUrl;
  } else {
    console.error("No invoiceUrl found in response:", responseData);
    throw new Error("URL de checkout não encontrada na resposta");
  }
}
