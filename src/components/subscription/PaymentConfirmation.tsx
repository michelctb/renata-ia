
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";

type PaymentConfirmationProps = {
  onReset: () => void;
  message?: string;
};

const PaymentConfirmation = ({ onReset, message }: PaymentConfirmationProps) => {
  return (
    <div className="max-w-md mx-auto text-center p-8 bg-card rounded-lg border shadow-sm">
      <div className="flex justify-center mb-6">
        <CheckCircleIcon className="h-16 w-16 text-green-500" />
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Solicitação Confirmada</h2>
      
      <p className="text-muted-foreground mb-6">
        {message || "Seu pedido foi processado com sucesso. Em caso de dúvidas, entre em contato com o suporte."}
      </p>
      
      <div className="flex flex-col space-y-4">
        <Button onClick={onReset} variant="outline">
          Escolher outro plano
        </Button>
        
        <Button asChild>
          <Link to="/">
            <HomeIcon className="mr-2 h-4 w-4" />
            Voltar para o início
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
