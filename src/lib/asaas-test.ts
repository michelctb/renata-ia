
// This file contains a test function to check if we can connect to the Asaas API

export async function testAsaasConnection() {
  const API_URL = "https://api-sandbox.asaas.com/v3";
  const ACCESS_TOKEN = "aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6Ojc5NmJmNDI3LTZiYzItNDE3MC1iZTgxLTVmNTg3MGEzMTY2Nzo6JGFhY2hfYjQ5MDUxZDUtMzdiYi00NDMyLThlZTQtYjEwMGVjOGZhNWNl";
  
  console.log("Testing Asaas API connection...");
  
  try {
    // Try to make a simple GET request to check if the API is accessible
    const response = await fetch(`${API_URL}/status`, {
      method: "GET",
      headers: {
        accept: "application/json",
        "access_token": ACCESS_TOKEN
      }
    });
    
    console.log("Asaas API test response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }));
      console.error("Asaas API test error:", errorData);
      return {
        success: false,
        status: response.status,
        statusText: response.statusText,
        error: errorData
      };
    }
    
    const data = await response.json();
    console.log("Asaas API test successful:", data);
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Asaas API test error:", error);
    return {
      success: false,
      error
    };
  }
}
