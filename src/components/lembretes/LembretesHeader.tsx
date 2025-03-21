
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

interface LembretesHeaderProps {
  onAddNew: () => void;
  isUserActive: boolean;
  isProcessing?: boolean;
}

export function LembretesHeader({ 
  onAddNew, 
  isUserActive, 
  isProcessing = false 
}: LembretesHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center mb-6">
      <h2 className="text-2xl font-bold dark:text-white">Lembretes</h2>
      <Button 
        onClick={onAddNew} 
        disabled={!isUserActive || isProcessing}
        className="dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
      >
        <PlusIcon className="h-4 w-4 mr-1" />
        Novo Lembrete
      </Button>
    </div>
  );
}
