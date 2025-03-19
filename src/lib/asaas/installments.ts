
import { asaasRequest } from "./networking";
import { InstallmentData, InstallmentResponse } from "./types";

// Create installment for semestral or annual plan
export async function createInstallment({ customer, plan, installmentCount }: InstallmentData): Promise<InstallmentResponse> {
  console.log("Creating installment with customer ID:", customer);
  
  try {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1); // Start tomorrow
    
    const value = plan === "semestral" ? 12.9 : 9.9;
    const description = `Renata.ia - Plano ${plan === "semestral" ? "Semestral" : "Anual"}`;
    
    const installmentData = {
      billingType: "CREDIT_CARD",
      installmentCount,
      customer,
      value,
      dueDate: dueDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      description
    };
    
    console.log("Installment data:", JSON.stringify(installmentData));
    
    const installment = await asaasRequest<InstallmentResponse>("/installments", "POST", installmentData);
    console.log("Installment created successfully:", installment);
    return installment;
  } catch (error) {
    console.error("Error creating installment:", error);
    throw error;
  }
}
