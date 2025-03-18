
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlanType, PLANS } from "@/pages/Subscription";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { createCustomer, createSubscription, createInstallment, getInvoiceUrl, CustomerData } from "@/lib/asaas";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Form schema
const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  cpfCnpj: z.string().min(11, "CPF deve ter 11 dígitos").max(14, "CNPJ deve ter 14 dígitos"),
  email: z.string().email("E-mail inválido"),
  mobilePhone: z.string().min(10, "Celular deve ter pelo menos 10 dígitos")
});

// This ensures the customer data matches exactly what the API expects
type CustomerFormValues = z.infer<typeof formSchema>;

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
    resolver: zodResolver(formSchema),
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
        console.log("Creating CustomerData object from form data");
        // Ensure all required fields exist by explicitly creating a CustomerData object
        const customerData: CustomerData = {
          name: formData.name,
          cpfCnpj: formData.cpfCnpj,
          email: formData.email,
          mobilePhone: formData.mobilePhone
        };
        
        console.log("Calling createCustomer with data:", customerData);
        // 1. Create customer in Asaas with properly typed data
        const customer = await createCustomer(customerData);
        
        if (!customer || !customer.id) {
          console.error("Customer creation failed or returned invalid data:", customer);
          throw new Error("Falha ao criar cliente no Asaas");
        }
        
        console.log("Customer created successfully with ID:", customer.id);
        
        // 2. Create payment according to plan
        let paymentId: string;
        
        if (plan === "mensal") {
          console.log("Creating monthly subscription");
          const subscription = await createSubscription({
            customer: customer.id,
            plan
          });
          console.log("Subscription created:", subscription);
          paymentId = subscription.id;
        } else {
          console.log(`Creating ${plan} installment plan`);
          const installmentCount = plan === "semestral" ? 6 : 12;
          const installment = await createInstallment({
            customer: customer.id,
            plan,
            installmentCount
          });
          console.log("Installment created:", installment);
          paymentId = installment.id;
        }
        
        // 3. Get invoice URL
        console.log("Getting invoice URL for payment ID:", paymentId);
        const invoiceUrl = await getInvoiceUrl({
          id: paymentId,
          type: plan === "mensal" ? "subscription" : "installment"
        });
        
        // 4. Redirect to payment page
        if (invoiceUrl) {
          console.log("Redirecting to invoice URL:", invoiceUrl);
          window.location.href = invoiceUrl;
          onComplete(); // This will run only if the redirection is blocked
        } else {
          console.error("No invoice URL returned");
          throw new Error("Não foi possível obter o link de pagamento");
        }
      } else {
        // For mensal, semestral, and anual plans, send to webhook URL
        const webhookUrl = "http://localhost:5678/webhook-test/renata-ia";
        
        const webhookData = {
          plano: plan,
          nome: formData.name,
          cpf: formData.cpfCnpj,
          email: formData.email,
          celular: formData.mobilePhone
        };
        
        console.log("Sending data to webhook:", webhookData);
        
        // Send data to webhook
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookData),
        });
        
        if (!response.ok) {
          throw new Error(`Erro ao enviar dados: ${response.statusText}`);
        }
        
        console.log("Webhook response:", await response.text());
        
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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input placeholder="Digite seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cpfCnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF/CNPJ</FormLabel>
                <FormControl>
                  <Input placeholder="Apenas números" {...field} />
                </FormControl>
                <FormDescription>
                  CPF (11 dígitos) ou CNPJ (14 dígitos) sem pontuação
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="mobilePhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Celular</FormLabel>
                <FormControl>
                  <Input placeholder="DDD + número" {...field} />
                </FormControl>
                <FormDescription>
                  Exemplo: 11999887766 (apenas números)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
