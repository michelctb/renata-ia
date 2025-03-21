
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Transaction } from "@/lib/supabase/types";

interface DeleteTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  transaction: Transaction | null;
}

export function DeleteTransactionDialog({
  open,
  onOpenChange,
  onConfirm,
  transaction
}: DeleteTransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        
        {transaction && (
          <div className="py-4">
            <p><strong>Descrição:</strong> {transaction.descrição}</p>
            <p><strong>Valor:</strong> R$ {transaction.valor.toFixed(2)}</p>
            <p><strong>Data:</strong> {transaction.data}</p>
            <p><strong>Tipo:</strong> {transaction.operação === 'entrada' ? 'Receita' : 'Despesa'}</p>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
