
// Asaas API integration

const API_URL = "https://api-sandbox.asaas.com/v3";
const ACCESS_TOKEN = "aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6Ojc5NmJmNDI3LTZiYzItNDE3MC1iZTgxLTVmNTg3MGEzMTY2Nzo6JGFhY2hfYjQ5MDUxZDUtMzdiYi00NDMyLThlZTQtYjEwMGVjOGZhNWNl";

// Proxy URL para contornar CORS se necessário
const PROXY_URL = "https://cors-anywhere.herokuapp.com/";

// Define se deve usar proxy ou não
let useProxy = false;

// Common headers for all requests
const headers = {
  accept: "application/json",
  "access_token": ACCESS_TOKEN,
  "content-type": "application/json"
};

// Função auxiliar para fazer requisições com suporte a proxy
async function fetchWithFallback(url, options) {
  console.log(`Fetching: ${url}`);
  console.log(`Options: ${JSON.stringify(options)}`);
  
  try {
    // Primeiro tenta diretamente
    if (!useProxy) {
      console.log("Trying direct API call first...");
      try {
        const response = await fetch(url, {
          ...options,
          mode: "cors",
          credentials: "omit"
        });
        console.log(`Direct API call status: ${response.status}`);
        return response;
      } catch (directError) {
        console.error("Direct API call failed:", directError);
        console.log("Falling back to proxy...");
        useProxy = true; // Ativa o proxy para futuras chamadas
      }
    }
    
    // Se o modo direto falhar ou useProxy estiver ativo, tenta via proxy
    if (useProxy) {
      console.log("Using proxy for API call");
      const proxyResponse = await fetch(`${PROXY_URL}${url}`, {
        ...options,
        mode: "cors",
        credentials: "omit"
      });
      console.log(`Proxy API call status: ${proxyResponse.status}`);
      return proxyResponse;
    }
  } catch (error) {
    console.error("All fetch attempts failed:", error);
    throw error;
  }
}

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
  console.log("Creating customer with data:", JSON.stringify(customerData));
  console.log("API URL:", `${API_URL}/customers`);
  console.log("Headers:", JSON.stringify(headers));
  
  try {
    console.log("Sending request to Asaas API...");
    const response = await fetchWithFallback(`${API_URL}/customers`, {
      method: "POST",
      headers,
      body: JSON.stringify(customerData)
    });
    
    console.log("Response status:", response.status);
    console.log("Response status text:", response.statusText);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }));
      console.error("Asaas API error:", errorData);
      throw new Error(`Failed to create customer: ${response.statusText}. Details: ${JSON.stringify(errorData)}`);
    }
    
    const responseData = await response.json();
    console.log("Customer created successfully:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
}

// Create subscription for monthly plan
export async function createSubscription({ customer, plan }: SubscriptionData) {
  console.log("Creating subscription with customer ID:", customer);
  
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
    
    console.log("Subscription data:", JSON.stringify(subscriptionData));
    
    const response = await fetchWithFallback(`${API_URL}/subscriptions`, {
      method: "POST",
      headers,
      body: JSON.stringify(subscriptionData)
    });
    
    console.log("Subscription response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }));
      console.error("Asaas API error:", errorData);
      throw new Error(`Failed to create subscription: ${response.statusText}. Details: ${JSON.stringify(errorData)}`);
    }
    
    const responseData = await response.json();
    console.log("Subscription created successfully:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
}

// Create installment for semestral or annual plan
export async function createInstallment({ customer, plan, installmentCount }: InstallmentData) {
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
    
    const response = await fetchWithFallback(`${API_URL}/installments`, {
      method: "POST",
      headers,
      body: JSON.stringify(installmentData)
    });
    
    console.log("Installment response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }));
      console.error("Asaas API error:", errorData);
      throw new Error(`Failed to create installment: ${response.statusText}. Details: ${JSON.stringify(errorData)}`);
    }
    
    const responseData = await response.json();
    console.log("Installment created successfully:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error creating installment:", error);
    throw error;
  }
}

// Get invoice URL
export async function getInvoiceUrl({ id, type }: InvoiceUrlData) {
  console.log(`Getting invoice URL for ${type} with ID:`, id);
  
  try {
    const queryParam = type === "subscription" ? `subscription=${id}` : `installment=${id}`;
    console.log("Query parameter:", queryParam);
    
    const response = await fetchWithFallback(`${API_URL}/payments?${queryParam}`, {
      method: "GET",
      headers
    });
    
    console.log("Invoice URL response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }));
      console.error("Asaas API error:", errorData);
      throw new Error(`Failed to get payments: ${response.statusText}. Details: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    console.log("Payments data:", data);
    
    if (data.data && data.data.length > 0 && data.data[0].invoiceUrl) {
      console.log("Invoice URL found:", data.data[0].invoiceUrl);
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
