
import React from 'react';

export interface ChartErrorDisplayProps {
  errorMessage: string;
}

export function ChartErrorDisplay({ errorMessage }: ChartErrorDisplayProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
      <p className="mb-2">Erro ao processar dados do gráfico</p>
      <p className="mb-4 text-xs text-red-500">{errorMessage}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="text-sm text-primary hover:underline"
      >
        Recarregar página
      </button>
    </div>
  );
}
