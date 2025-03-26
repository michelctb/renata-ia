
import { useState } from "react";
import { CreditCardIcon, CalendarIcon, RocketIcon, UsersIcon, SparklesIcon } from "lucide-react";
import CustomerForm from "@/components/subscription/CustomerForm";
import PaymentConfirmation from "@/components/subscription/PaymentConfirmation";
import PageHeader from "@/components/subscription/PageHeader";
import PlanGrid from "@/components/subscription/PlanGrid";
import Header from "@/components/landing/Header";

// Plan types
export type PlanType = "mensal" | "semestral" | "anual" | "consultor" | "teste";

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
    title: "Consultor Financeiro",
    price: "",
    description: "Agende uma demonstração",
    icon: UsersIcon
  },
  teste: {
    title: "Teste Grátis",
    price: "Grátis",
    description: "7 dias de teste grátis",
    icon: SparklesIcon
  }
};

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted transition-colors duration-300">
      <Header />
      <div className="flex-1 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <PageHeader 
            title="Planos de Assinatura Renata.ia" 
            description="Escolha o plano ideal para suas necessidades e comece a utilizar nossa plataforma financeira inteligente."
          />
          
          {!selectedPlan && !showConfirmation && (
            <PlanGrid onPlanSelect={handlePlanSelect} />
          )}

          {showConfirmation ? (
            <PaymentConfirmation onReset={resetFlow} />
          ) : selectedPlan ? (
            <CustomerForm 
              plan={selectedPlan} 
              onBack={() => setSelectedPlan(null)} 
              onComplete={handlePaymentComplete}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
