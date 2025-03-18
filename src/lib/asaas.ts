
// Asaas API integration

const API_URL = "https://api-sandbox.asaas.com/v3";
const ACCESS_TOKEN = "aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6Ojc5NmJmNDI3LTZiYzItNDE3MC1iZTgxLTVmNTg3MGEzMTY2Nzo6JGFhY2hfYjQ5MDUxZDUtMzdiYi00NDMyLThlZTQtYjEwMGVjOGZhNWNl";

// Common headers for all requests
const headers = {
  accept: "application/json",
  "access_token": ACCESS_TOKEN,
  "content-type": "application/json"
};

// Types
export type CustomerData = {
  name: string;
  cpfCnpj: string;
  email: string;
  mobilePhone: string;
};

type SubscriptionData = {
  customer: string;
  plan: string;
};

type InstallmentData = {
  customer: string;
  plan: string;
  installmentCount: number;
};

type InvoiceUrlData = {
  id: string;
  type: "subscription" | "installment";
};

// Create customer in Asaas
export async function createCustomer(customerData: CustomerData) {
  try {
    const response = await fetch(`${API_URL}/customers`, {
      method: "POST",
      headers,
      body: JSON.stringify(customerData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Asaas API error:", errorData);
      throw new Error(`Failed to create customer: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
}

// Create subscription for monthly plan
export async function createSubscription({ customer, plan }: SubscriptionData) {
  try {
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + 1); // Start tomorrow
    
    const subscriptionData = {
      billingType: "CREDIT_CARD",
      cycle: "MONTHLY",
      customer,
      value: 14.9,
      nextDueDate: nextDueDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      description: "Renata.ia - Plano Mensal"
    };
    
    const response = await fetch(`${API_URL}/subscriptions`, {
      method: "POST",
      headers,
      body: JSON.stringify(subscriptionData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Asaas API error:", errorData);
      throw new Error(`Failed to create subscription: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
}

// Create installment for semestral or annual plan
export async function createInstallment({ customer, plan, installmentCount }: InstallmentData) {
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
    
    const response = await fetch(`${API_URL}/installments`, {
      method: "POST",
      headers,
      body: JSON.stringify(installmentData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Asaas API error:", errorData);
      throw new Error(`Failed to create installment: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error creating installment:", error);
    throw error;
  }
}

// Get invoice URL
export async function getInvoiceUrl({ id, type }: InvoiceUrlData) {
  try {
    const queryParam = type === "subscription" ? `subscription=${id}` : `installment=${id}`;
    const response = await fetch(`${API_URL}/payments?${queryParam}`, {
      method: "GET",
      headers
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Asaas API error:", errorData);
      throw new Error(`Failed to get payments: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.data && data.data.length > 0 && data.data[0].invoiceUrl) {
      return data.data[0].invoiceUrl;
    } else {
      console.error("No invoice URL found in response:", data);
      return null;
    }
  } catch (error) {
    console.error("Error getting invoice URL:", error);
    throw error;
  }
}
