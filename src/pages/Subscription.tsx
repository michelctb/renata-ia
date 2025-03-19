
import { useState } from "react";
import { CreditCardIcon, CalendarIcon, RocketIcon, UsersIcon } from "lucide-react";
import CustomerForm from "@/components/subscription/CustomerForm";
import PaymentConfirmation from "@/components/subscription/PaymentConfirmation";
import PageHeader from "@/components/subscription/PageHeader";
import PlanGrid from "@/components/subscription/PlanGrid";

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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 sm:p-8 transition-colors duration-300">
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
  );
};

export default SubscriptionPage;
