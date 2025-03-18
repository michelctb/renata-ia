
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanType, PLANS } from "@/pages/Subscription";

type PlanCardProps = {
  planKey: PlanType;
  onSelect: (plan: PlanType) => void;
};

const PlanCard = ({ planKey, onSelect }: PlanCardProps) => {
  const plan = PLANS[planKey];
  const PlanIcon = plan.icon;
  const isConsultor = planKey === "consultor";

  return (
    <Card className="flex flex-col h-full border-2 hover:border-primary transition-all hover:shadow-md">
      <CardHeader>
        <div className="p-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <PlanIcon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>{plan.title}</CardTitle>
        {plan.price && (
          <div className="text-3xl font-bold mt-2">
            {plan.price}
            <span className="text-sm text-muted-foreground font-normal ml-1">
              {planKey === "mensal" ? "/mês" : ""}
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
          onClick={() => onSelect(planKey)}
        >
          {isConsultor ? "Agende uma demonstração" : "Assinar agora"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
