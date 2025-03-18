
// This file contains a test function to check if we can connect to the Asaas API

export async function testAsaasConnection() {
  const API_URL = "https://api-sandbox.asaas.com/v3";
  const ACCESS_TOKEN = "aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6Ojc5NmJmNDI3LTZiYzItNDE3MC1iZTgxLTVmNTg3MGEzMTY2Nzo6JGFhY2hfYjQ5MDUxZDUtMzdiYi00NDMyLThlZTQtYjEwMGVjOGZhNWNl";
  
  console.log("Testing Asaas API connection...");
  console.log("API URL:", API_URL);
  console.log("Using endpoint:", `${API_URL}/status`);
  
  try {
    // Try to make a simple GET request to check if the API is accessible
    console.log("Preparing fetch request with headers...");
    const headers = {
      accept: "application/json",
      "access_token": ACCESS_TOKEN
    };
    console.log("Request headers:", JSON.stringify(headers));
    
    console.log("Sending fetch request...");
    const response = await fetch(`${API_URL}/status`, {
      method: "GET",
      headers,
      mode: "cors" // Explicitly set CORS mode
    });
    
    console.log("Received response from API");
    console.log("Response status:", response.status);
    console.log("Response status text:", response.statusText);
    console.log("Response headers:", JSON.stringify(Object.fromEntries([...response.headers])));
    
    if (!response.ok) {
      console.error("Response was not OK");
      try {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (parseError) {
          console.error("Failed to parse error response as JSON:", parseError);
          errorData = { message: errorText || "Failed to parse error response" };
        }
        
        console.error("Asaas API test error:", errorData);
        return {
          success: false,
          status: response.status,
          statusText: response.statusText,
          error: errorData
        };
      } catch (textError) {
        console.error("Failed to get response text:", textError);
        return {
          success: false,
          status: response.status,
          statusText: response.statusText,
          error: { message: "Failed to get response text" }
        };
      }
    }
    
    console.log("Response was OK, parsing JSON...");
    try {
      const data = await response.json();
      console.log("Successfully parsed JSON response:", data);
      return {
        success: true,
        data
      };
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      return {
        success: false,
        error: { message: "Failed to parse JSON response" }
      };
    }
  } catch (error) {
    console.error("Fetch threw an exception:", error);
    // Enhanced error object with all available properties
    const errorDetails = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      cause: error.cause,
    };
    console.error("Detailed error:", errorDetails);
    return {
      success: false,
      error: errorDetails
    };
  }
}
