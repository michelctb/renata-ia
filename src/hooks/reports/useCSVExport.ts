
import { useState } from 'react';
import { toast } from 'sonner';

interface Transaction {
  data: string;
  descricao: string;
  categoria: string;
  valor: number;
  operação: string;
  [key: string]: any;
}

export const useCSVExport = (transactions: Transaction[]) => {
  const [isExporting, setIsExporting] = useState(false);

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

  return { isExporting, exportCSV };
};
