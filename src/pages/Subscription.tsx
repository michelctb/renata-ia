
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CreditCardIcon, RocketIcon, UsersIcon } from "lucide-react";
import CustomerForm from "@/components/subscription/CustomerForm";
import PaymentConfirmation from "@/components/subscription/PaymentConfirmation";
import { testAsaasConnection } from "@/lib/asaas-test";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Plan types
export type PlanType = "mensal" | "semestral" | "anual" | "consultor";

// Plan details
export const PLANS = {
  mensal: {
    title: "Mensal",
    price: "R$ 14,90",
    description: "Cobrança mensal recorrente",
    icon: CreditCardIcon
  },
  semestral: {
    title: "Semestral",
    price: "R$ 12,90",
    description: "Em 6 parcelas",
    icon: CalendarIcon
  },
  anual: {
    title: "Anual",
    price: "R$ 9,90",
    description: "Em 12 parcelas",
    icon: RocketIcon
  },
  consultor: {
    title: "Consultor",
    price: "",
    description: "Agende uma demonstração",
    icon: UsersIcon
  }
};

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<any>(null);
  
  const handlePlanSelect = (plan: PlanType) => {
    if (plan === "consultor") {
      window.open("https://calendly.com/renata-ia/30min", "_blank");
    } else {
      setSelectedPlan(plan);
    }
  };
  
  const handlePaymentComplete = () => {
    setShowConfirmation(true);
  };
  
  const resetFlow = () => {
    setSelectedPlan(null);
    setShowConfirmation(false);
  };

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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Planos de Assinatura Renata.ia</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Escolha o plano ideal para suas necessidades e comece a utilizar nossa plataforma financeira inteligente.
          </p>
          {!selectedPlan && !showConfirmation && (
            <>
              <Button 
                variant="outline" 
                onClick={handleTestApiConnection}
                disabled={isTestingApi}
                className="mt-4"
              >
                {isTestingApi ? "Testando..." : "Testar conexão com API"}
              </Button>
              
              {apiTestResult && (
                <div className="mt-4 max-w-lg mx-auto">
                  <Alert variant={apiTestResult.success ? "default" : "destructive"}>
                    <AlertDescription>
                      {apiTestResult.success 
                        ? "Conexão com a API do Asaas estabelecida com sucesso!" 
                        : `Erro na conexão: ${apiTestResult.error?.message || apiTestResult.statusText || "Erro desconhecido"}`
                      }
                    </AlertDescription>
                  </Alert>
                  
                  {!apiTestResult.success && (
                    <div className="mt-2 text-left p-4 bg-muted rounded text-xs overflow-auto max-h-40">
                      <p className="font-semibold">Detalhes do erro:</p>
                      <pre>{JSON.stringify(apiTestResult, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {showConfirmation ? (
          <PaymentConfirmation onReset={resetFlow} />
        ) : selectedPlan ? (
          <CustomerForm 
            plan={selectedPlan} 
            onBack={() => setSelectedPlan(null)} 
            onComplete={handlePaymentComplete}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(PLANS).map(([key, plan]) => {
              const PlanIcon = plan.icon;
              const isConsultor = key === "consultor";
              
              return (
                <Card key={key} className="flex flex-col h-full border-2 hover:border-primary transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="p-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <PlanIcon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{plan.title}</CardTitle>
                    {plan.price && (
                      <div className="text-3xl font-bold mt-2">
                        {plan.price}
                        <span className="text-sm text-muted-foreground font-normal ml-1">
                          {key === "mensal" ? "/mês" : ""}
                        </span>
                      </div>
                    )}
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <span className="mr-2 text-primary">✓</span>
                        <span>Acesso a todas as funcionalidades</span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 text-primary">✓</span>
                        <span>Suporte especializado</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={isConsultor ? "outline" : "default"}
                      onClick={() => handlePlanSelect(key as PlanType)}
                    >
                      {isConsultor ? "Agende uma demonstração" : "Assinar agora"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
