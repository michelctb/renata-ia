
import { CustomerFormValues } from "../customerFormSchema";
import { PlanType } from "@/pages/Subscription";
import { 
  CustomerData, 
  createCustomer, 
  createSubscription, 
  createInstallment, 
  getInvoiceUrl 
} from "@/lib/asaas/index";

// This function is no longer used but kept for reference
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
