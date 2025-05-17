
import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileDown } from 'lucide-react';

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
  const [isExporting, setIsExporting] = useState(false);
  
  // Função para exportar dados como CSV com suporte a caracteres especiais
  const exportCSV = () => {
    try {
      setIsExporting(true);
      toast.info("Gerando exportação CSV, aguarde...");
      
      // Formatar transações como CSV
      const headers = ["Data", "Descrição", "Categoria", "Valor", "Tipo"];
      
      // Usar BOM (Byte Order Mark) para garantir que caracteres especiais sejam reconhecidos corretamente
      const BOM = "\uFEFF";
      
      const csvRows = [
        headers.join(","),
        ...transactions.map(t => [
          t.data,
          `"${(t.descricao || '').replace(/"/g, '""')}"`, // Escape aspas duplicando-as
          `"${(t.categoria || '').replace(/"/g, '""')}"`,
          t.valor,
          t.operação
        ].join(","))
      ];
      
      const csvContent = BOM + csvRows.join("\n");
      
      // Criar um blob com o encoding UTF-8 para preservar acentos e caracteres especiais
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      
      // Criar link para download
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `relatorio_financeiro_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Limpar
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsExporting(false);
        toast.success("Exportação CSV concluída com sucesso!");
      }, 100);
    } catch (error) {
      console.error("Erro na exportação CSV:", error);
      toast.error("Falha ao exportar dados como CSV");
      setIsExporting(false);
    }
  };
  
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
          <Button
            onClick={exportCSV}
            className="w-full"
            variant="default"
            size="sm"
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Exportando dados...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4 mr-2" />
                Exportar dados como CSV
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
