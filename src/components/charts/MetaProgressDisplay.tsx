
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MetaProgressBar } from '@/components/metas/MetaProgressBar';

interface MetaProgressItem {
  meta: {
    categoria: string;
    valor_meta: number;
  };
  valor_atual: number;
  porcentagem: number;
  status: 'baixo' | 'médio' | 'alto' | 'excedido';
}

interface MetaProgressDisplayProps {
  metasComProgresso: MetaProgressItem[];
}

export function MetaProgressDisplay({ metasComProgresso }: MetaProgressDisplayProps) {
  if (metasComProgresso.length === 0) return null;
  
  return (
    <Card className="border-none shadow-md animate-fade-up col-span-1 lg:col-span-3" style={{ animationDelay: '0.4s' }}>
      <CardHeader className="pb-2">
        <CardTitle>Progresso das Metas</CardTitle>
        <CardDescription>Acompanhamento das metas de gastos por categoria</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metasComProgresso.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.meta.categoria}</span>
                <span className="text-sm text-muted-foreground">
                  Meta: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.meta.valor_meta)}
                </span>
              </div>
              <MetaProgressBar 
                valor_atual={item.valor_atual}
                valor_meta={item.meta.valor_meta}
                porcentagem={item.porcentagem}
                status={item.status}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
