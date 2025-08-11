
import { asaasRequest } from "./networking";
import { CustomerData, CustomerResponse } from "./types";

// Create customer in Asaas
export async function createCustomer(customerData: CustomerData): Promise<CustomerResponse> {
  console.log("Creating customer");
  
  try {
    const customer = await asaasRequest<CustomerResponse>("/customers", "POST", customerData);
    console.log("Customer created successfully with id:", customer?.id);
    return customer;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
}
