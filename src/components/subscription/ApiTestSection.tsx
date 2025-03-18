
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { testAsaasConnection } from "@/lib/asaas-test";
import { toast } from "sonner";

const ApiTestSection = () => {
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<any>(null);

  const handleTestApiConnection = async () => {
    setIsTestingApi(true);
    setApiTestResult(null);
    
    try {
      console.log("Starting Asaas API connection test...");
      const result = await testAsaasConnection();
      console.log("API test completed with result:", result);
      
      setApiTestResult(result);
      
      if (result.success) {
        toast.success("API do Asaas está funcionando corretamente!");
      } else {
        const errorMessage = result.error?.message || "Erro desconhecido";
        toast.error(`Erro ao conectar com a API do Asaas: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Exception during API test:", error);
      setApiTestResult({ success: false, error });
      toast.error("Erro ao testar conexão com a API");
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-4 space-y-2">
      <Button 
        variant="outline" 
        onClick={handleTestApiConnection}
        disabled={isTestingApi}
        className="flex items-center gap-2"
      >
        {isTestingApi ? "Testando..." : "Testar conexão com API"}
      </Button>
      
      <a 
        href="https://docs.asaas.com/reference/uso-das-apis" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-sm text-primary flex items-center gap-1 hover:underline"
      >
        Documentação da API <ExternalLinkIcon size={14} />
      </a>
      
      {apiTestResult && (
        <div className="mt-4 max-w-lg mx-auto">
          <Alert variant={apiTestResult.success ? "default" : "destructive"}>
            {apiTestResult.success ? (
              <>
                <AlertTitle>Conexão estabelecida</AlertTitle>
                <AlertDescription>
                  Conexão com a API do Asaas estabelecida com sucesso via método: {apiTestResult.method || "direto"}
                </AlertDescription>
              </>
            ) : (
              <>
                <AlertTitle>Erro de conexão</AlertTitle>
                <AlertDescription>
                  {`Erro na conexão: ${apiTestResult.error?.message || apiTestResult.statusText || "Erro desconhecido"}`}
                </AlertDescription>
              </>
            )}
          </Alert>
          
          {!apiTestResult.success && (
            <div className="mt-4">
              <div className="text-left p-4 bg-muted rounded text-xs overflow-auto max-h-40">
                <p className="font-semibold">Detalhes do erro:</p>
                <pre>{JSON.stringify(apiTestResult, null, 2)}</pre>
              </div>
              
              {apiTestResult.suggestions && (
                <div className="mt-4 text-left">
                  <h4 className="font-medium mb-2">Possíveis soluções:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {apiTestResult.suggestions.map((suggestion: string, index: number) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiTestSection;
