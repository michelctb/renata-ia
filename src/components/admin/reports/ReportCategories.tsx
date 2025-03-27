
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface ReportCategoriesProps {
  transactions: any[];
  categoryData: any[];
}

const ReportCategories: React.FC<ReportCategoriesProps> = ({ transactions, categoryData }) => {
  const totalGasto = transactions
    .filter(t => t.operação === 'saída')
    .reduce((sum, t) => sum + Number(t.valor || 0), 0);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Análise por Categorias</h3>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Total Gasto</TableHead>
                <TableHead>% do Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryData.map((category, i) => {
                const percentagem = totalGasto > 0 
                  ? ((category.value / totalGasto) * 100).toFixed(1) 
                  : '0.0';
                  
                return (
                  <TableRow key={i}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>R$ {category.value.toFixed(2)}</TableCell>
                    <TableCell>{percentagem}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportCategories;
