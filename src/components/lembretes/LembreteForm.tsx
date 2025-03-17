
import { Lembrete } from '@/lib/lembretes';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { LembreteFormFields } from './LembreteFormFields';
import { useLembreteForm } from './useLembreteForm';

interface LembreteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Lembrete) => void;
  editingLembrete: Lembrete | null; // Fixed typo in variable name
  userId: string;
}

export function LembreteForm({
  isOpen,
  onClose,
  onSubmit,
  editingLembrete, // Fixed typo in variable name
  userId,
}: LembreteFormProps) {
  const { form, handleSubmit, handleClose } = useLembreteForm({
    onSubmit,
    onClose,
    editingLembrete, // Fixed typo in variable name
    userId,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingLembrete ? 'Editar Lembrete' : 'Novo Lembrete'}</DialogTitle>
          <DialogDescription>
            {editingLembrete 
              ? 'Edite os dados do lembrete selecionado.'
              : 'Preencha os dados para registrar um novo lembrete.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <LembreteFormFields form={form} />
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingLembrete ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default LembreteForm;
