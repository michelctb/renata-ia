
// This file contains a test function to check if we can connect to the Asaas API

export async function testAsaasConnection() {
  const API_URL = "https://api-sandbox.asaas.com/v3";
  const ACCESS_TOKEN = "aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6Ojc5NmJmNDI3LTZiYzItNDE3MC1iZTgxLTVmNTg3MGEzMTY2Nzo6JGFhY2hfYjQ5MDUxZDUtMzdiYi00NDMyLThlZTQtYjEwMGVjOGZhNWNl";
  
  console.log("Testing Asaas API connection...");
  console.log("API URL:", API_URL);
  console.log("Using endpoint:", `${API_URL}/status`);
  
  try {
    // Usando uma abordagem alternativa para evitar problemas de CORS
    console.log("Preparing fetch request with headers...");
    const headers = {
      accept: "application/json",
      "access_token": ACCESS_TOKEN
    };
    console.log("Request headers:", JSON.stringify(headers));
    
    // Utilizamos um proxy alternativo para evitar CORS
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const targetUrl = `${API_URL}/status`;
    
    console.log("Sending fetch request through proxy...");
    console.log("Target URL:", targetUrl);
    
    // Tentativa 1: Usando o proxy CORS Anywhere
    try {
      const response = await fetch(`${proxyUrl}${targetUrl}`, {
        method: "GET",
        headers,
      });
      
      console.log("Received response from API (proxy attempt)");
      console.log("Response status:", response.status);
      console.log("Response status text:", response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Successfully parsed JSON response:", data);
        return {
          success: true,
          data,
          method: "proxy"
        };
      } else {
        console.log("Proxy attempt failed, continuing to direct approach");
      }
    } catch (proxyError) {
      console.log("Proxy attempt failed with error:", proxyError);
      console.log("Continuing to direct approach...");
    }
    
    // Tentativa 2: Abordagem direta com configuração CORS explícita
    console.log("Trying direct approach with explicit CORS mode...");
    const response = await fetch(`${API_URL}/status`, {
      method: "GET",
      headers,
      mode: "cors",
      credentials: "omit"
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
          error: errorData,
          method: "direct"
        };
      } catch (textError) {
        console.error("Failed to get response text:", textError);
        return {
          success: false,
          status: response.status,
          statusText: response.statusText,
          error: { message: "Failed to get response text" },
          method: "direct"
        };
      }
    }
    
    console.log("Response was OK, parsing JSON...");
    try {
      const data = await response.json();
      console.log("Successfully parsed JSON response:", data);
      return {
        success: true,
        data,
        method: "direct"
      };
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      return {
        success: false,
        error: { message: "Failed to parse JSON response" },
        method: "direct"
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
    
    // Sugestão de alternativas para o usuário
    return {
      success: false,
      error: errorDetails,
      suggestions: [
        "O erro 'Failed to fetch' geralmente indica um problema de CORS. Tente usar uma extensão de navegador que desabilite CORS para testes.",
        "Verifique se o token de acesso é válido e está ativo.",
        "Confira se sua conexão com a internet está funcionando corretamente.",
        "A API sandbox do Asaas pode estar com instabilidade temporária."
      ]
    };
  }
}
