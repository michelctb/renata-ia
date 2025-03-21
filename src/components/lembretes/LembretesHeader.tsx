
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

interface LembretesHeaderProps {
  onAddNew: () => void;
  isUserActive: boolean;
  isProcessing?: boolean;
  viewMode?: 'user' | 'admin' | 'consultor';
}

export function LembretesHeader({ 
  onAddNew, 
  isUserActive, 
  isProcessing = false,
  viewMode = 'user'
}: LembretesHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lembretes</h2>
      <Button 
        onClick={onAddNew} 
        disabled={!isUserActive || isProcessing || viewMode === 'consultor'}
        className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
      >
        <PlusIcon className="h-4 w-4 mr-1" />
        {viewMode === 'consultor' ? 'Modo Visualização' : 'Novo Lembrete'}
      </Button>
    </div>
  );
}
