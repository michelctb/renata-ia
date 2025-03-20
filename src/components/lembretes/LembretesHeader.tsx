
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

interface LembretesHeaderProps {
  onAddNew: () => void;
  isUserActive: boolean;
  isProcessing: boolean;
}

export function LembretesHeader({ onAddNew, isUserActive, isProcessing }: LembretesHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Lembretes</h2>
      <Button onClick={onAddNew} disabled={!isUserActive || isProcessing}>
        <PlusIcon className="h-4 w-4 mr-2" />
        Novo Lembrete
      </Button>
    </div>
  );
}
