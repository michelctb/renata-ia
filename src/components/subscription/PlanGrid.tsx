
import PlanCard from "./PlanCard";
import { PlanType, PLANS } from "@/pages/Subscription";

type PlanGridProps = {
  onPlanSelect: (plan: PlanType) => void;
};

const PlanGrid = ({ onPlanSelect }: PlanGridProps) => {
  // Definir a ordem personalizada dos planos
  const orderedPlanKeys: PlanType[] = ["teste", "mensal", "semestral", "anual", "consultor"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in py-4">
      {/* Renderiza os primeiros 4 planos em uma linha */}
      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {orderedPlanKeys.slice(0, 4).map((key) => (
          <PlanCard 
            key={key} 
            planKey={key as PlanType} 
            onSelect={onPlanSelect} 
          />
        ))}
      </div>
      
      {/* Renderiza o plano de consultor numa linha separada */}
      <div className="col-span-full flex justify-center mt-8">
        <div className="w-full max-w-md">
          <PlanCard 
            key="consultor" 
            planKey="consultor" 
            onSelect={onPlanSelect} 
          />
        </div>
      </div>
    </div>
  );
};

export default PlanGrid;
