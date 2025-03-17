
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Lembrete, addLembrete, updateLembrete } from '@/lib/lembretes';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface LembreteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Lembrete) => void;
  editingLembrete: Lembrete | null;
  userId: string;
}

const lembreteSchema = z.object({
  lembrete: z.string().min(1, "Descrição é obrigatória"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  valor: z.coerce.number().optional(),
  vencimento: z.date({
    required_error: "Data de vencimento é obrigatória",
  }),
});

type LembreteFormValues = z.infer<typeof lembreteSchema>;

export function LembreteForm({
  isOpen,
  onClose,
  onSubmit,
  editingLembrete,
  userId,
}: LembreteFormProps) {
  const form = useForm<LembreteFormValues>({
    resolver: zodResolver(lembreteSchema),
    defaultValues: {
      lembrete: editingLembrete?.lembrete || "",
      tipo: editingLembrete?.tipo || "fixo",
      valor: editingLembrete?.valor || undefined,
      vencimento: editingLembrete?.vencimento ? new Date(editingLembrete.vencimento) : new Date(),
    },
  });

  const handleSubmit = async (values: LembreteFormValues) => {
    try {
      const lembreteData: Lembrete = {
        lembrete: values.lembrete, // Ensuring lembrete is required and set
        tipo: values.tipo,
        valor: values.valor,
        telefone: userId,
        cliente: userId,
        vencimento: values.vencimento.toISOString().split('T')[0],
        lembrar: values.vencimento.toISOString().split('T')[0],
        ...(editingLembrete?.id ? { id: editingLembrete.id } : {}),
      };

      if (editingLembrete) {
        await updateLembrete(lembreteData);
        toast.success('Lembrete atualizado com sucesso');
      } else {
        await addLembrete(lembreteData);
        toast.success('Lembrete adicionado com sucesso');
      }

      onSubmit(lembreteData);
    } catch (error) {
      console.error('Error saving lembrete:', error);
      toast.error(editingLembrete ? 'Erro ao atualizar lembrete' : 'Erro ao adicionar lembrete');
    }
  };

  // Função para lidar com o fechamento explícito do modal
  const handleClose = () => {
    form.reset(); // Resetar o formulário antes de fechar
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose(); // Usar o método handleClose em vez de onClose diretamente
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="lembrete"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição do lembrete" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fixo">Fixo</SelectItem>
                        <SelectItem value="eventual">Eventual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0,00"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="vencimento"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Vencimento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal flex justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="h-4 w-4 ml-auto" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={ptBR}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
