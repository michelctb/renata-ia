
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
import { createCustomer, createSubscription, createInstallment, getInvoiceUrl } from "@/lib/asaas";

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

  const onSubmit = async (data: CustomerFormValues) => {
    setIsSubmitting(true);
    
    try {
      // 1. Create customer in Asaas - now we're passing data that matches the expected type
      const customer = await createCustomer(data);
      
      if (!customer || !customer.id) {
        throw new Error("Falha ao criar cliente no Asaas");
      }
      
      // 2. Create payment according to plan
      let paymentId: string;
      
      if (plan === "mensal") {
        const subscription = await createSubscription({
          customer: customer.id,
          plan
        });
        paymentId = subscription.id;
      } else {
        const installmentCount = plan === "semestral" ? 6 : 12;
        const installment = await createInstallment({
          customer: customer.id,
          plan,
          installmentCount
        });
        paymentId = installment.id;
      }
      
      // 3. Get invoice URL
      const invoiceUrl = await getInvoiceUrl({
        id: paymentId,
        type: plan === "mensal" ? "subscription" : "installment"
      });
      
      // 4. Redirect to payment page
      if (invoiceUrl) {
        window.location.href = invoiceUrl;
        onComplete(); // This will run only if the redirection is blocked
      } else {
        throw new Error("Não foi possível obter o link de pagamento");
      }
    } catch (error) {
      console.error("Erro no processo de pagamento:", error);
      toast.error("Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.");
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
