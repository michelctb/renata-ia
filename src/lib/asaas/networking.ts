
import { API_URL, PROXY_URL, headers } from "./config";

// Flag to determine if proxy should be used
let useProxy = false;

// Function to handle fetching with proxy fallback
export async function fetchWithFallback(url: string, options: RequestInit) {
  console.log(`Fetching: ${url}`);
  console.log(`Options: ${JSON.stringify(options)}`);
  
  try {
    // First try direct API call
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
        useProxy = true; // Activate proxy for future calls
      }
    }
    
    // If direct mode fails or useProxy is active, try via proxy
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

// Helper function to make API requests to Asaas
export async function asaasRequest<T>(endpoint: string, method: string, data?: any): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetchWithFallback(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }));
    console.error("Asaas API error:", errorData);
    throw new Error(`Failed to ${method.toLowerCase()} ${endpoint}: ${response.statusText}. Details: ${JSON.stringify(errorData)}`);
  }
  
  return await response.json();
}
