
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanType, PLANS } from "@/pages/Subscription";
import { CheckIcon } from "lucide-react";

type PlanCardProps = {
  planKey: PlanType;
  onSelect: (plan: PlanType) => void;
};

const PlanCard = ({ planKey, onSelect }: PlanCardProps) => {
  const plan = PLANS[planKey];
  const PlanIcon = plan.icon;
  const isConsultor = planKey === "consultor";
  const isPopular = planKey === "anual";
  const isSemestral = planKey === "semestral";
  const isMensal = planKey === "mensal";

  return (
    <Card className={`flex flex-col h-full transition-all duration-300 hover:shadow-xl group relative overflow-hidden ${
      isPopular ? 'border-primary border-2 scale-105' : 'border-2 hover:border-primary'
    }`}>
      {isPopular && (
        <div className="absolute -right-12 top-6 bg-primary text-primary-foreground px-12 py-1 rotate-45 text-xs font-medium">
          POPULAR
        </div>
      )}
      
      <CardHeader>
        <div className={`p-3 w-14 h-14 rounded-full ${isPopular ? 'bg-primary text-primary-foreground' : 'bg-primary/10'} flex items-center justify-center mb-4 transition-all group-hover:scale-110`}>
          <PlanIcon className={`h-6 w-6 ${isPopular ? 'text-primary-foreground' : 'text-primary'}`} />
        </div>
        <CardTitle className="text-2xl">{plan.title}</CardTitle>
        {plan.price && (
          <div className="text-3xl font-bold mt-3 flex items-end">
            {plan.price}
            <span className="text-sm text-muted-foreground font-normal ml-1">
              /mês
            </span>
          </div>
        )}
        <CardDescription className="mt-2">{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3">
          <li className="flex items-center">
            <span className="mr-2 rounded-full bg-primary/10 p-1">
              <CheckIcon className="h-3 w-3 text-primary" />
            </span>
            <span>Acesso a todas as funcionalidades</span>
          </li>
          
          {isConsultor ? (
            <>
              <li className="flex items-center">
                <span className="mr-2 rounded-full bg-primary/10 p-1">
                  <CheckIcon className="h-3 w-3 text-primary" />
                </span>
                <span>Controle de clientes ativos</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 rounded-full bg-primary/10 p-1">
                  <CheckIcon className="h-3 w-3 text-primary" />
                </span>
                <span>Conta gratuita para consultor</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 rounded-full bg-primary/10 p-1">
                  <CheckIcon className="h-3 w-3 text-primary" />
                </span>
                <span>Suporte especializado</span>
              </li>
            </>
          ) : isMensal ? (
            <>
              <li className="flex items-center">
                <span className="mr-2 rounded-full bg-primary/10 p-1">
                  <CheckIcon className="h-3 w-3 text-primary" />
                </span>
                <span>Controle de transações financeiras via Whatsapp</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 rounded-full bg-primary/10 p-1">
                  <CheckIcon className="h-3 w-3 text-primary" />
                </span>
                <span>Dashboard financeiro</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 rounded-full bg-primary/10 p-1">
                  <CheckIcon className="h-3 w-3 text-primary" />
                </span>
                <span>Lembrete de contas a pagar</span>
              </li>
            </>
          ) : null}
          
          {isSemestral && (
            <li className="flex items-center">
              <span className="mr-2 rounded-full bg-primary/10 p-1">
                <CheckIcon className="h-3 w-3 text-primary" />
              </span>
              <span className="font-medium">Economia de 13% no valor mensal</span>
            </li>
          )}
          
          {isPopular && (
            <li className="flex items-center">
              <span className="mr-2 rounded-full bg-primary/10 p-1">
                <CheckIcon className="h-3 w-3 text-primary" />
              </span>
              <span className="font-medium">Economia de 33% no valor mensal</span>
            </li>
          )}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full transition-all ${isPopular ? 'bg-primary hover:bg-primary/90' : ''}`}
          variant={isConsultor ? "outline" : "default"}
          onClick={() => onSelect(planKey)}
          size="lg"
        >
          {isConsultor ? "Agende uma demonstração" : "Assinar agora"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
