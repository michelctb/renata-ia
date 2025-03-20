
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
import { useEffect, useState } from 'react';

interface LembreteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Lembrete) => void;
  editingLembrete: Lembrete | null;
  userId: string;
}

export function LembreteForm({
  isOpen,
  onClose,
  onSubmit,
  editingLembrete,
  userId,
}: LembreteFormProps) {
  console.log('LembreteForm rendered with editingLembrete:', editingLembrete);
  console.log('Is dialog open:', isOpen);
  
  // Use uma cópia local do editingLembrete para evitar loops infinitos
  const [localEditingLembrete, setLocalEditingLembrete] = useState<Lembrete | null>(null);
  
  // Atualiza a cópia local apenas quando o diálogo é aberto ou o editingLembrete muda
  useEffect(() => {
    if (isOpen && editingLembrete) {
      console.log('Updating local editing lembrete:', editingLembrete);
      // Criar uma cópia profunda para evitar problemas de referência
      setLocalEditingLembrete(JSON.parse(JSON.stringify(editingLembrete)));
    } else if (!isOpen) {
      console.log('Dialog closed, resetting local editing lembrete');
      // Limpar o lembrete local quando o diálogo fecha
      setLocalEditingLembrete(null);
    }
  }, [isOpen, editingLembrete]);
  
  const { form, handleSubmit, handleClose } = useLembreteForm({
    onSubmit,
    onClose,
    editingLembrete: localEditingLembrete,
    userId,
  });

  const onCloseWrapper = () => {
    console.log('Close wrapper called');
    handleClose();
    setLocalEditingLembrete(null);
  };

  // Logging the form state
  useEffect(() => {
    if (isOpen) {
      console.log('Current form values:', form.getValues());
    }
  }, [isOpen, form]);

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        console.log('Dialog onOpenChange:', open);
        if (!open) {
          console.log('Dialog closing, calling onCloseWrapper');
          onCloseWrapper();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{localEditingLembrete ? 'Editar Lembrete' : 'Novo Lembrete'}</DialogTitle>
          <DialogDescription>
            {localEditingLembrete 
              ? 'Edite os dados do lembrete selecionado.'
              : 'Preencha os dados para registrar um novo lembrete.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <LembreteFormFields form={form} />
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onCloseWrapper}>
                Cancelar
              </Button>
              <Button type="submit">
                {localEditingLembrete ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default LembreteForm;
