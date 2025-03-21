
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MetaProgressBar } from '../MetaProgressBar';
import { Pencil, Trash } from 'lucide-react';
import { MetaCategoria, MetaProgresso } from '@/lib/metas';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface MetaItemProps {
  metaProgresso: MetaProgresso;
  onEdit: (meta: MetaCategoria) => void;
  onDelete: (id: number, categoria: string) => void;
}

export function MetaItem({ metaProgresso, onEdit, onDelete }: MetaItemProps) {
  // Renderizar período da meta em formato legível
  const renderPeriodo = (meta: MetaCategoria) => {
    if (meta.periodo === 'mensal' && meta.mes_referencia && meta.ano_referencia) {
      const date = new Date(meta.ano_referencia, meta.mes_referencia - 1, 1);
      return format(date, 'MMMM / yyyy', { locale: pt });
    } else if (meta.periodo === 'anual' && meta.ano_referencia) {
      return `Ano ${meta.ano_referencia}`;
    } else {
      return meta.periodo;
    }
  };

  return (
    <Card key={metaProgresso.meta.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            {metaProgresso.meta.categoria}
          </CardTitle>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(metaProgresso.meta)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(metaProgresso.meta.id!, metaProgresso.meta.categoria)}
              className="h-8 w-8 text-red-500 hover:text-red-600"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Período: {renderPeriodo(metaProgresso.meta)}
        </div>
      </CardHeader>
      
      <CardContent>
        <MetaProgressBar
          valor_atual={metaProgresso.valor_atual}
          valor_meta={metaProgresso.meta.valor_meta}
          porcentagem={metaProgresso.porcentagem}
          status={metaProgresso.status}
        />
      </CardContent>
    </Card>
  );
}
