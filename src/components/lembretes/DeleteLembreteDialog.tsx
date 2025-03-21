
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Lembrete } from "@/lib/lembretes";

export interface DeleteLembreteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  lembreteId: number | null;
  lembrete?: Lembrete;
}

export function DeleteLembreteDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  lembreteId,
  lembrete
}: DeleteLembreteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Lembrete</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este lembrete? Esta ação não pode ser desfeita.
            {lembrete && (
              <div className="mt-2 p-2 bg-muted rounded-md">
                <p className="font-medium">{lembrete.lembrete}</p>
                {lembrete.valor && (
                  <p className="text-sm">Valor: R$ {lembrete.valor.toFixed(2)}</p>
                )}
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
