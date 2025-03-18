
import PlanCard from "./PlanCard";
import { PlanType, PLANS } from "@/pages/Subscription";

type PlanGridProps = {
  onPlanSelect: (plan: PlanType) => void;
};

const PlanGrid = ({ onPlanSelect }: PlanGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(PLANS).map(([key]) => (
        <PlanCard 
          key={key} 
          planKey={key as PlanType} 
          onSelect={onPlanSelect} 
        />
      ))}
    </div>
  );
};

export default PlanGrid;
