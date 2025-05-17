
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCSVExport } from '@/hooks/reports/useCSVExport';
import { ExportCSVButton } from './export/ExportCSVButton';

interface ReportGeneratorProps {
  transactions: any[];
  monthlyData: any[];
  categoryData: any[];
  metasComProgresso: any[];
  dateRange: any;
  clientId?: string;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  transactions,
  monthlyData,
  categoryData,
  metasComProgresso,
  dateRange,
  clientId
}) => {
  // Hook para exportação CSV com suporte a caracteres especiais
  const { isExporting, exportCSV } = useCSVExport(transactions);
  
  // Se não houver transações, não renderize o componente
  if (transactions.length === 0) {
    return null;
  }
  
  return (
    <div>
      <Card className="mt-4 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Exportar Dados</CardTitle>
          <CardDescription>
            Exporte seus dados financeiros em formato CSV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExportCSVButton 
            onClick={exportCSV}
            isExporting={isExporting}
          />
        </CardContent>
      </Card>
    </div>
  );
};
