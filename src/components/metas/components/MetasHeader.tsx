
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

export function MetasHeader() {
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-bold tracking-tight">Metas de Gastos</h2>
      <p className="text-muted-foreground">
        Acompanhe e gerencie suas metas de gastos por categoria.
      </p>
    </div>
  );
}
