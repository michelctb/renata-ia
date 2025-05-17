
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BarChartIcon, CalendarIcon } from 'lucide-react';

interface ChartFilterToggleProps {
  respectDateFilter: boolean;
  onToggleChange: (value: boolean) => void;
}

export function ChartFilterToggle({ 
  respectDateFilter, 
  onToggleChange 
}: ChartFilterToggleProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2">
            <BarChartIcon 
              className={`h-4 w-4 ${!respectDateFilter ? 'text-primary' : 'text-muted-foreground'}`} 
            />
            <Switch 
              checked={respectDateFilter}
              onCheckedChange={onToggleChange}
              aria-label="Alternar modo do gráfico"
            />
            <CalendarIcon 
              className={`h-4 w-4 ${respectDateFilter ? 'text-primary' : 'text-muted-foreground'}`} 
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{respectDateFilter ? 
            'Modo filtrado: Mostra apenas dados do período selecionado' : 
            'Modo completo: Mostra dados de todos os períodos'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
