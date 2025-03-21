
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MetaCategoria, MetaProgresso } from '@/lib/metas';

interface MetasCardProps {
  userId: string;
  metas: MetaCategoria[];
  periodoAtual: string;
  onEditMeta: (meta: MetaCategoria) => void;
  onDeleteMeta: (id: number) => Promise<void>;
}

export function MetasCard({ 
  userId,
  metas,
  periodoAtual,
  onEditMeta,
  onDeleteMeta
}: MetasCardProps) {
  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Metas para {periodoAtual}</CardTitle>
        <CardDescription>
          Acompanhe o progresso das suas metas de gastos por categoria
        </CardDescription>
      </CardHeader>
      <CardContent>
        {metas.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {metas.map(meta => (
              <div key={meta.id} className="bg-background p-4 rounded-lg">
                <h3 className="font-medium">{meta.categoria}</h3>
                <p>Valor: R${meta.valor_meta.toFixed(2)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            Nenhuma meta definida para este período
          </p>
        )}
      </CardContent>
    </Card>
  );
}
