
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlanType, PLANS } from "@/pages/Subscription";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CustomerFormFields from "./CustomerFormFields";
import { customerFormSchema, CustomerFormValues } from "./customerFormSchema";
import { submitToWebhook } from "./services";

type CustomerFormProps = {
  plan: PlanType;
  onBack: () => void;
  onComplete: () => void;
};

const CustomerForm = ({ plan, onBack, onComplete }: CustomerFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const planInfo = PLANS[plan];

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      cpfCnpj: "",
      email: "",
      mobilePhone: ""
    }
  });

  const onSubmit = async (formData: CustomerFormValues) => {
    console.log("Form submitted with data:", formData);
    console.log("Selected plan:", plan);
    
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      console.log("Calling submitToWebhook...");
      
      // Chamar o webhook e processar a resposta
      const response = await submitToWebhook(formData, plan);
      
      if (response.status === 'success') {
        // Exibir mensagem de sucesso
        toast.success(response.message);
        setSuccessMessage(response.message);
        
        // Se for o plano de teste, apenas mostrar a mensagem
        if (plan === 'teste') {
          onComplete(); // Atualizar o estado da UI para mostrar tela de confirmação
        } 
        // Se for outro plano e tiver URL de redirecionamento, redirecionar
        else if (response.redirectUrl) {
          // Redirecionar para a URL recebida
          console.log("Redirecting to:", response.redirectUrl);
          window.location.href = response.redirectUrl;
        } else {
          // Se não tiver URL mas for sucesso, apenas mostrar a confirmação
          onComplete();
        }
      } else {
        // Exibir mensagem de erro
        console.error("Error response:", response);
        setError(response.message);
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Erro no processo:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Ocorreu um erro ao processar a solicitação. Por favor, tente novamente.";
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-card rounded-lg border shadow-sm p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack} 
          disabled={isSubmitting}
          className="mr-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          Finalize sua assinatura - {planInfo.title}
        </h2>
      </div>
      
      <div className="mb-6 p-4 bg-muted rounded-md">
        <div className="flex justify-between items-center">
          <span>Plano selecionado:</span>
          <span className="font-semibold">{planInfo.title}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span>Valor:</span>
          <span className="font-semibold">{planInfo.price}</span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CustomerFormFields form={form} />
          
          <Button 
            type="submit" 
            className="w-full mt-6" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Continuar para pagamento"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CustomerForm;
