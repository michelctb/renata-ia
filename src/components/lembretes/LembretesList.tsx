
import { Lembrete } from '@/lib/lembretes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';
import { LembreteActions } from './LembreteActions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LembretesListProps {
  lembretes: Lembrete[];
  onEdit: (lembrete: Lembrete) => void;
  onDelete: (id: number) => void;
  isUserActive?: boolean;
}

export default function LembretesList({
  lembretes,
  onEdit,
  onDelete,
  isUserActive = true
}: LembretesListProps) {
  if (lembretes.length === 0) {
    return (
      <Card className="border-dashed mt-4">
        <CardContent className="pt-6 text-center text-muted-foreground">
          Nenhum lembrete cadastrado.
        </CardContent>
      </Card>
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
        return <Badge className="bg-blue-500">Fixo</Badge>;
      case 'variável':
        return <Badge className="bg-amber-500">Variável</Badge>;
      case 'eventual':
        return <Badge className="bg-purple-500">Eventual</Badge>;
      default:
        return <Badge>{tipo}</Badge>;
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-230px)] pr-4">
      <div className="space-y-4">
        {sortedLembretes.map((lembrete) => (
          <Card key={lembrete.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{lembrete.lembrete}</CardTitle>
                <LembreteActions 
                  lembrete={lembrete}
                  onEdit={() => onEdit(lembrete)}
                  onDelete={() => lembrete.id && onDelete(lembrete.id)}
                  isUserActive={isUserActive}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Vencimento</p>
                  <p className="font-medium">
                    {lembrete.vencimento ? 
                      format(new Date(lembrete.vencimento), 'dd/MM/yyyy', { locale: ptBR }) : 
                      'Data não definida'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="font-medium">
                    {lembrete.valor ? formatCurrency(lembrete.valor) : 'Não informado'}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                {getLembreteBadge(lembrete.tipo || '')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
