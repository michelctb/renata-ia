
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Sao_Paulo';

interface ReportDetailedProps {
  transactions: any[];
}

const ReportDetailed: React.FC<ReportDetailedProps> = ({ transactions }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Relatório Detalhado</h3>
      <Card>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white dark:bg-gray-800">
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Operação</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions
                  .sort((a, b) => {
                    const dateA = parseISO(a.data);
                    const dateB = parseISO(b.data);
                    return dateB.getTime() - dateA.getTime();
                  })
                  .map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {format(
                          utcToZonedTime(parseISO(transaction.data), TIMEZONE),
                          'dd/MM/yyyy'
                        )}
                      </TableCell>
                      <TableCell>{transaction.descrição || '-'}</TableCell>
                      <TableCell>{transaction.categoria || '-'}</TableCell>
                      <TableCell>{transaction.operação === 'entrada' ? 'Receita' : 'Despesa'}</TableCell>
                      <TableCell className={transaction.operação === 'entrada' ? 'text-green-600' : 'text-red-600'}>
                        R$ {Number(transaction.valor || 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportDetailed;
