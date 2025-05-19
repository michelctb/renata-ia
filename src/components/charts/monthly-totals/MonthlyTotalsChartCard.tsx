
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyTotalItem } from "@/hooks/reports/useMonthlyTotalsData";
import { MonthlyTotalsChart } from "./MonthlyTotalsChart";
import { MonthlyTotalsEmpty } from "./MonthlyTotalsEmpty";
import { MonthlyTotalsError } from "./MonthlyTotalsError";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  
  // Estado para controlar se o gráfico respeita o filtro de data
  const [respectDateFilter, setRespectDateFilter] = useState(false);
  
  // Estado para controlar se devemos destacar meses dentro do filtro
  const [highlightFilteredMonths, setHighlightFilteredMonths] = useState(true);

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

    if (!data?.length) {
      return <MonthlyTotalsEmpty />;
    }

    return (
      <MonthlyTotalsChart 
        data={data} 
        showSaldo={showSaldo}
        highlightFilteredMonths={highlightFilteredMonths && !respectDateFilter} 
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
          
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4 mt-2 sm:mt-0">
            <div className="flex items-center space-x-2">
              <Switch 
                id="show-saldo" 
                checked={showSaldo} 
                onCheckedChange={setShowSaldo} 
              />
              <Label htmlFor="show-saldo">Mostrar Saldo</Label>
            </div>

            <Tabs 
              value={respectDateFilter ? "filtered" : "all"} 
              onValueChange={(value) => setRespectDateFilter(value === "filtered")}
              className="w-full md:w-auto"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">Todos os meses</TabsTrigger>
                <TabsTrigger value="filtered">Período filtrado</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
