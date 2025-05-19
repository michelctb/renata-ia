
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyTotalItem } from "@/hooks/reports/useMonthlyTotalsData";
import { MonthlyTotalsChart } from "./MonthlyTotalsChart";
import { MonthlyTotalsEmpty } from "./MonthlyTotalsEmpty";
import { MonthlyTotalsError } from "./MonthlyTotalsError";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface MonthlyTotalsChartCardProps {
  data: MonthlyTotalItem[];
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
}

export function MonthlyTotalsChartCard({
  data,
  isLoading = false,
  hasError = false,
  errorMessage,
  className = ""
}: MonthlyTotalsChartCardProps) {
  // Estado para controlar a exibição da linha de saldo
  const [showSaldo, setShowSaldo] = useState(true);
  
  // Sempre destacar meses dentro do filtro - sempre ativado
  // Modificado para ser sempre true e não permitir mudança
  const highlightFilteredMonths = true;

  // Renderizar o conteúdo com base no estado
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-pulse text-muted-foreground">Carregando dados...</div>
        </div>
      );
    }

    if (hasError) {
      return <MonthlyTotalsError message={errorMessage} />;
    }

    // Mesmo se não houver dados, o MonthlyTotalsChart lidará com isso
    // e manterá a altura consistente
    return (
      <MonthlyTotalsChart 
        data={data} 
        showSaldo={showSaldo}
        highlightFilteredMonths={highlightFilteredMonths}
        height={300} // Definindo uma altura fixa para consistência
      />
    );
  };

  return (
    <Card className={`shadow-sm ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <CardTitle>Totais Mensais</CardTitle>
            <CardDescription>Visão geral das entradas e saídas por mês</CardDescription>
          </div>
          
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <Switch 
              id="show-saldo" 
              checked={showSaldo} 
              onCheckedChange={setShowSaldo} 
            />
            <Label htmlFor="show-saldo">Mostrar Saldo</Label>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-6 h-[350px]">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
