
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface ReportSummaryProps {
  transactions: any[];
  monthlyData: any[];
}

const ReportSummary: React.FC<ReportSummaryProps> = ({ transactions, monthlyData }) => {
  const totalReceitas = transactions
    .filter(t => t.operação === 'entrada')
    .reduce((sum, t) => sum + Number(t.valor || 0), 0);

  const totalDespesas = transactions
    .filter(t => t.operação === 'saída')
    .reduce((sum, t) => sum + Number(t.valor || 0), 0);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Resumo Financeiro</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total de Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              R$ {totalReceitas.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              R$ {totalDespesas.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Transações por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead>Receitas</TableHead>
                <TableHead>Despesas</TableHead>
                <TableHead>Saldo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyData.map((month, i) => (
                <TableRow key={i}>
                  <TableCell>{month.month}</TableCell>
                  <TableCell className="text-green-600">R$ {month.receitas.toFixed(2)}</TableCell>
                  <TableCell className="text-red-600">R$ {month.despesas.toFixed(2)}</TableCell>
                  <TableCell className={month.receitas - month.despesas >= 0 ? 'text-green-600' : 'text-red-600'}>
                    R$ {(month.receitas - month.despesas).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportSummary;
