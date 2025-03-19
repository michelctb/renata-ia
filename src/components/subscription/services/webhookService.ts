
import { CustomerFormValues } from "../customerFormSchema";
import { PlanType } from "@/pages/Subscription";

// Handle the webhook submission for all plans
export async function submitToWebhook(formData: CustomerFormValues, plan: PlanType) {
  // Updated webhook URL for production environment
  const webhookUrl = "http://localhost:5678/webhook/renata-ia";
  
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
    // Send data to webhook
    console.log("Initiating fetch request to webhook...");
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookData),
      // Don't follow redirects automatically
      redirect: "manual"
    });
    
    console.log("Webhook response received");
    console.log("Webhook response status:", response.status);
    console.log("Webhook response type:", response.type);
    console.log("Webhook response headers:", [...response.headers.entries()]);
    
    // Handle redirect response (status 302, 303, etc.)
    if (response.type === "opaqueredirect") {
      // For redirect responses, get the Location header
      const redirectUrl = response.headers.get("Location");
      console.log("Redirect URL from headers:", redirectUrl);
      
      if (redirectUrl) {
        console.log("Valid redirect URL found in headers:", redirectUrl);
        return redirectUrl;
      } else {
        console.error("No Location header found in redirect response");
        throw new Error("URL de redirecionamento não encontrada na resposta");
      }
    }
    
    // If not a redirect, try to parse JSON response (fallback to original behavior)
    if (response.ok) {
      console.log("Response is OK, attempting to parse JSON...");
      try {
        const responseText = await response.text();
        console.log("Raw response text:", responseText);
        
        let responseData;
        try {
          responseData = JSON.parse(responseText);
          console.log("Successfully parsed JSON response:", responseData);
        } catch (jsonError) {
          console.error("Failed to parse JSON:", jsonError);
          console.log("Response might not be JSON format");
          
          // If the response contains a URL, try to extract it as a fallback
          if (responseText.includes("http")) {
            const urlMatch = responseText.match(/(https?:\/\/[^\s"']+)/);
            if (urlMatch && urlMatch[0]) {
              console.log("Extracted URL from response text:", urlMatch[0]);
              return urlMatch[0];
            }
          }
          throw new Error("Resposta não está em formato JSON válido");
        }
        
        // Extract the invoiceUrl from the response
        if (responseData && responseData.invoiceUrl) {
          console.log("invoiceUrl found in response:", responseData.invoiceUrl);
          return responseData.invoiceUrl;
        } else if (responseData && typeof responseData === 'string' && responseData.startsWith('http')) {
          // Handle case where the response itself is a URL string
          console.log("Response is a URL string:", responseData);
          return responseData;
        } else {
          console.error("No invoiceUrl found in response:", responseData);
          throw new Error("URL de checkout não encontrada na resposta");
        }
      } catch (error) {
        console.error("Error processing response:", error);
        throw new Error("Erro ao processar resposta do webhook");
      }
    } else {
      console.error("Webhook request failed with status:", response.status);
      throw new Error(`Erro ao enviar dados: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Exception in webhook service:", error);
    throw error;
  }
}
