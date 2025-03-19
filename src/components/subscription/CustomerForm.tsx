
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
      // Send to webhook URL and receive invoiceUrl for checkout
      const checkoutLink = await submitToWebhook(formData, plan);
      
      console.log("Checkout link (invoiceUrl):", checkoutLink);
      
      // First call onComplete to update UI state
      onComplete();
      
      // Then show toast and redirect after a short delay
      toast.success("Redirecionando para o checkout...");
      
      // Use setTimeout to ensure the toast is shown before redirecting
      setTimeout(() => {
        // Ensure the URL is valid before redirecting
        if (checkoutLink && typeof checkoutLink === 'string' && checkoutLink.startsWith('http')) {
          console.log("Redirecting to:", checkoutLink);
          window.location.href = checkoutLink;
        } else {
          console.error("Invalid checkout URL:", checkoutLink);
          throw new Error("URL de checkout inválida");
        }
      }, 1000); // 1 second delay to ensure toast is visible
      
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
