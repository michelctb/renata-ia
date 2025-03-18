
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
import { processConsultorPayment, submitToWebhook } from "./subscriptionService";

type CustomerFormProps = {
  plan: PlanType;
  onBack: () => void;
  onComplete: () => void;
};

const CustomerForm = ({ plan, onBack, onComplete }: CustomerFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    
    try {
      // If we're on the 'consultor' plan, we should use the original flow
      if (plan === "consultor") {
        const invoiceUrl = await processConsultorPayment(formData, plan);
        
        // 4. Redirect to payment page
        console.log("Redirecting to invoice URL:", invoiceUrl);
        window.location.href = invoiceUrl;
        onComplete(); // This will run only if the redirection is blocked
      } else {
        // For mensal, semestral, and anual plans, send to webhook URL
        const response = await submitToWebhook(formData, plan);
        
        console.log("Webhook response:", response);
        
        toast.success("Informações enviadas com sucesso!");
        onComplete();
      }
    } catch (error) {
      console.error("Erro no processo:", error);
      setError("Ocorreu um erro ao processar a solicitação. Por favor, tente novamente.");
      toast.error("Ocorreu um erro ao processar a solicitação. Por favor, tente novamente.");
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
