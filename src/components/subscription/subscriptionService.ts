
import { CustomerData, createCustomer, createSubscription, createInstallment, getInvoiceUrl } from "@/lib/asaas";
import { PlanType } from "@/pages/Subscription";
import { CustomerFormValues } from "./customerFormSchema";

// Handle the webhook submission for non-consultor plans
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
  
  return await response.text();
}

// Handle the payment flow for the consultor plan
export async function processConsultorPayment(formData: CustomerFormValues, plan: PlanType) {
  console.log("Creating CustomerData object from form data");
  // Ensure all required fields exist by explicitly creating a CustomerData object
  const customerData: CustomerData = {
    name: formData.name,
    cpfCnpj: formData.cpfCnpj,
    email: formData.email,
    mobilePhone: formData.mobilePhone
  };
  
  console.log("Calling createCustomer with data:", customerData);
  // 1. Create customer in Asaas with properly typed data
  const customer = await createCustomer(customerData);
  
  if (!customer || !customer.id) {
    console.error("Customer creation failed or returned invalid data:", customer);
    throw new Error("Falha ao criar cliente no Asaas");
  }
  
  console.log("Customer created successfully with ID:", customer.id);
  
  // 2. Create payment according to plan
  let paymentId: string;
  
  // Since we're in the consultor path, we create a variable to avoid type narrowing
  const paymentType = plan as "mensal" | "semestral" | "anual" | "consultor";
  
  if (paymentType === "mensal") {
    console.log("Creating monthly subscription");
    const subscription = await createSubscription({
      customer: customer.id,
      plan
    });
    console.log("Subscription created:", subscription);
    paymentId = subscription.id;
  } else {
    console.log(`Creating ${plan} installment plan`);
    const installmentCount = paymentType === "semestral" ? 6 : 12;
    const installment = await createInstallment({
      customer: customer.id,
      plan,
      installmentCount
    });
    console.log("Installment created:", installment);
    paymentId = installment.id;
  }
  
  // 3. Get invoice URL
  console.log("Getting invoice URL for payment ID:", paymentId);
  const invoiceUrl = await getInvoiceUrl({
    id: paymentId,
    type: paymentType === "mensal" ? "subscription" : "installment"
  });
  
  if (!invoiceUrl) {
    console.error("No invoice URL returned");
    throw new Error("Não foi possível obter o link de pagamento");
  }
  
  return invoiceUrl;
}
