
import { asaasRequest } from "./networking";
import { InvoiceUrlData, PaymentResponse } from "./types";

// Get invoice URL
export async function getInvoiceUrl({ id, type }: InvoiceUrlData): Promise<string | null> {
  console.log(`Getting invoice URL for ${type} with ID:`, id);
  
  try {
    const queryParam = type === "subscription" ? `subscription=${id}` : `installment=${id}`;
    console.log("Query parameter:", queryParam);
    
    const response = await asaasRequest<{ data: PaymentResponse[] }>(`/payments?${queryParam}`, "GET");
    console.log("Payments fetched:", Array.isArray(response.data) ? response.data.length : 0);
    
    if (response.data && response.data.length > 0 && response.data[0].invoiceUrl) {
      console.log("Invoice URL found");
      return response.data[0].invoiceUrl;
    } else {
      console.warn("No invoice URL found in response");
      return null;
    }
  } catch (error) {
    console.error("Error getting invoice URL:", error);
    throw error;
  }
}
