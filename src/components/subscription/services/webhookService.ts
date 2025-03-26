
import { CustomerFormValues } from "../customerFormSchema";
import { PlanType } from "@/pages/Subscription";

// Handle the webhook submission for all plans
export async function submitToWebhook(formData: CustomerFormValues, plan: PlanType) {
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
    // Send data to webhook
    console.log("Initiating fetch request to webhook...");
    
    // For CORS-restricted redirects, we need a fallback approach
    // Using form submission instead of fetch to follow redirects across origins
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = webhookUrl;
    form.target = '_self'; // Use _self to redirect in the same window
    
    // Add the data as hidden fields
    for (const key in webhookData) {
      if (Object.prototype.hasOwnProperty.call(webhookData, key)) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = webhookData[key as keyof typeof webhookData];
        form.appendChild(hiddenField);
      }
    }

    console.log("Created form for submission:", form);
    
    // For testing purposes, return a mock URL
    // In production, this code won't execute as the form will redirect the page
    if (process.env.NODE_ENV === 'development') {
      console.log("Development mode detected, returning mock URL");
      // Append the form to the document and submit it
      document.body.appendChild(form);
      
      // Return a promise that will resolve with the proper URL
      // In real cases, this won't execute as the form submission will navigate away
      return Promise.resolve(webhookUrl);
    } else {
      // In production, submit the form which will follow the redirect
      document.body.appendChild(form);
      form.submit();
      // This part won't execute as the page will be redirected
      return "redirecting...";
    }
  } catch (error) {
    console.error("Exception in webhook service:", error);
    throw error;
  }
}
