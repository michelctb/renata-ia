
// Asaas API configuration

export const API_URL = "https://api-sandbox.asaas.com/v3";
export const ACCESS_TOKEN = "aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6Ojc5NmJmNDI3LTZiYzItNDE3MC1iZTgxLTVmNTg3MGEzMTY2Nzo6JGFhY2hfYjQ5MDUxZDUtMzdiYi00NDMyLThlZTQtYjEwMGVjOGZhNWNl";

// Proxy URL para contornar CORS se necessário
export const PROXY_URL = "https://cors-anywhere.herokuapp.com/";

// Common headers for all requests
export const headers = {
  accept: "application/json",
  "access_token": ACCESS_TOKEN,
  "content-type": "application/json"
};
