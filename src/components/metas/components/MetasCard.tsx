
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MetaProgresso } from '@/lib/metas';
import { MetasList } from '../MetasList';

interface MetasCardProps {
  userId: string;
  metasProgresso: MetaProgresso[];
  periodoAtual: string;
  onSaveMeta: (meta: any) => Promise<void>;
  onDeleteMeta: (id: number) => Promise<void>;
}

export function MetasCard({ 
  userId,
  metasProgresso,
  periodoAtual,
  onSaveMeta,
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
        <MetasList 
          userId={userId}
          metas={metasProgresso}
          onSaveMeta={onSaveMeta}
          onDeleteMeta={onDeleteMeta}
        />
      </CardContent>
    </Card>
  );
}
