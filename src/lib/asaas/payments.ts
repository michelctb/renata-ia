
import { asaasRequest } from "./networking";
import { InvoiceUrlData, PaymentResponse } from "./types";

// Get invoice URL
export async function getInvoiceUrl({ id, type }: InvoiceUrlData): Promise<string | null> {
  console.log(`Getting invoice URL for ${type} with ID:`, id);
  
  try {
    const queryParam = type === "subscription" ? `subscription=${id}` : `installment=${id}`;
    console.log("Query parameter:", queryParam);
    
    const response = await asaasRequest<{ data: PaymentResponse[] }>(`/payments?${queryParam}`, "GET");
    console.log("Payments data:", response);
    
    if (response.data && response.data.length > 0 && response.data[0].invoiceUrl) {
      console.log("Invoice URL found:", response.data[0].invoiceUrl);
      return response.data[0].invoiceUrl;
    } else {
      console.error("No invoice URL found in response:", response);
      return null;
    }
  } catch (error) {
    console.error("Error getting invoice URL:", error);
    throw error;
  }
}
