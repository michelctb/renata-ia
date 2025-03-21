
import { Lembrete } from '@/lib/lembretes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';
import { LembreteActions } from './LembreteActions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LembretesListProps {
  lembretes: Lembrete[];
  onEdit: (lembrete: Lembrete) => void;
  onDelete: (id: number) => void;
  isUserActive?: boolean;
  isProcessing?: boolean;
}

export default function LembretesList({
  lembretes,
  onEdit,
  onDelete,
  isUserActive = true,
  isProcessing = false
}: LembretesListProps) {
  if (lembretes.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-md mt-4 dark:border-gray-700 dark:text-gray-300">
        Nenhum lembrete cadastrado.
      </div>
    );
  }

  // Sort lembretes by vencimento date
  const sortedLembretes = [...lembretes].sort((a, b) => {
    const dateA = new Date(a.vencimento);
    const dateB = new Date(b.vencimento);
    return dateA.getTime() - dateB.getTime();
  });

  const getLembreteBadge = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'fixo':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Fixo</Badge>;
      case 'variável':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Variável</Badge>;
      case 'eventual':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Eventual</Badge>;
      default:
        return <Badge>{tipo}</Badge>;
    }
  };

  // Função para formatar a data adequadamente
  const formatData = (dataString: string) => {
    try {
      // Extrair ano, mês e dia diretamente da string de data
      const [year, month, day] = dataString.split('-').map(Number);
      
      // Criar um objeto Date com horário meio-dia para evitar problemas de fuso horário
      const date = new Date(year, month - 1, day, 12, 0, 0);
      
      // Formatar a data usando o format do date-fns
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error, dataString);
      return 'Data inválida';
    }
  };

  // Calculate total value
  const totalValue = sortedLembretes.reduce((sum, lembrete) => {
    return sum + (lembrete.valor || 0);
  }, 0);

  return (
    <div className="rounded-md border border-border dark:border-gray-700 overflow-hidden mt-4">
      <ScrollArea className="h-[calc(100vh-280px)]">
        <Table>
          <TableHeader className="bg-muted/50 dark:bg-gray-800">
            <TableRow className="hover:bg-transparent dark:border-gray-700">
              <TableHead className="text-foreground dark:text-gray-300">Nome</TableHead>
              <TableHead className="text-foreground dark:text-gray-300">Vencimento</TableHead>
              <TableHead className="text-foreground dark:text-gray-300">Tipo</TableHead>
              <TableHead className="text-foreground dark:text-gray-300">Valor</TableHead>
              <TableHead className="text-right text-foreground dark:text-gray-300">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLembretes.map((lembrete) => (
              <TableRow 
                key={lembrete.id}
                className="dark:border-gray-700 dark:bg-gray-800/40 dark:hover:bg-gray-700/40"
              >
                <TableCell className="font-medium dark:text-gray-200">{lembrete.lembrete}</TableCell>
                <TableCell className="dark:text-gray-300">
                  {lembrete.vencimento ? formatData(lembrete.vencimento) : 'Não definida'}
                </TableCell>
                <TableCell>
                  {lembrete.tipo ? getLembreteBadge(lembrete.tipo) : '-'}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {lembrete.valor ? formatCurrency(lembrete.valor) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <LembreteActions 
                    lembrete={lembrete}
                    onEdit={() => onEdit(lembrete)}
                    onDelete={() => lembrete.id && onDelete(lembrete.id)}
                    isUserActive={isUserActive}
                    isProcessing={isProcessing}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-muted/30 dark:bg-gray-800/80 dark:border-t dark:border-gray-700">
            <TableRow className="dark:border-gray-700">
              <TableCell colSpan={3} className="font-medium text-right dark:text-gray-200">Total:</TableCell>
              <TableCell className="font-bold dark:text-white">{formatCurrency(totalValue)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ScrollArea>
    </div>
  );
}
