
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Lembrete } from '@/lib/lembretes';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LembreteActions } from './LembreteActions';
import { BellIcon, AlertCircle } from 'lucide-react';

interface LembretesListProps {
  lembretes: Lembrete[];
  onEdit: (lembrete: Lembrete) => void;
  onDelete: (id: number) => void;
}

const LembretesList: React.FC<LembretesListProps> = ({ 
  lembretes, 
  onEdit, 
  onDelete 
}) => {
  if (lembretes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <BellIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Nenhum lembrete encontrado</h3>
        <p className="text-muted-foreground mt-2">
          Clique em "Novo Lembrete" para adicionar seu primeiro lembrete.
        </p>
      </div>
    );
  }

  const isLembreteOverdue = (vencimento: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const vencimentoDate = new Date(vencimento);
    return vencimentoDate < today;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lembretes.map((lembrete) => {
              const overdue = isLembreteOverdue(lembrete.vencimento);
              
              return (
                <TableRow key={lembrete.id} className={overdue ? 'bg-red-50' : ''}>
                  <TableCell className="font-medium">
                    {lembrete.lembrete}
                    {overdue && (
                      <span className="inline-flex items-center ml-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{lembrete.tipo}</TableCell>
                  <TableCell>
                    {lembrete.valor ? 
                      new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(lembrete.valor) : 
                      '-'}
                  </TableCell>
                  <TableCell>
                    {lembrete.vencimento ? 
                      format(new Date(lembrete.vencimento), 'dd/MM/yyyy', { locale: ptBR }) : 
                      '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <LembreteActions
                      lembrete={lembrete}
                      onEdit={() => onEdit(lembrete)}
                      onDelete={() => onDelete(lembrete.id || 0)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LembretesList;
