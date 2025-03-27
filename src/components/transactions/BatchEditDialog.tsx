
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Category } from '@/lib/categories';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Transaction } from '@/lib/supabase/types';

// Schema para validação do formulário
const batchEditSchema = z.object({
  updateDate: z.boolean().default(false),
  data: z.date().optional(),
  updateCategory: z.boolean().default(false),
  categoria: z.string().optional(),
  updateDescription: z.boolean().default(false),
  descrição: z.string().optional(),
});

type BatchEditFormValues = z.infer<typeof batchEditSchema>;

interface BatchEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  selectedTransactions: Transaction[];
  categories: Category[];
  isLoadingCategories: boolean;
}

export function BatchEditDialog({
  isOpen,
  onClose,
  onSubmit,
  selectedTransactions,
  categories,
  isLoadingCategories,
}: BatchEditDialogProps) {
  const form = useForm<BatchEditFormValues>({
    resolver: zodResolver(batchEditSchema),
    defaultValues: {
      updateDate: false,
      data: undefined,
      updateCategory: false,
      categoria: '',
      updateDescription: false,
      descrição: '',
    },
  });

  const updateDate = form.watch('updateDate');
  const updateCategory = form.watch('updateCategory');
  const updateDescription = form.watch('updateDescription');

  // Filtramos as categorias com base no tipo de operação das transações selecionadas
  const getFilteredCategories = () => {
    if (selectedTransactions.length === 0) return categories;

    // Verificamos se todas as transações são do mesmo tipo
    const allSameType = selectedTransactions.every(
      t => t.operação === selectedTransactions[0].operação
    );

    if (allSameType) {
      const operationType = selectedTransactions[0].operação;
      return categories.filter(
        cat => cat.tipo === 'ambos' || cat.tipo.toLowerCase() === operationType.toLowerCase()
      );
    }

    // Se existirem tipos misturados, exibimos apenas categorias "ambos"
    return categories.filter(cat => cat.tipo === 'ambos');
  };

  const filteredCategories = getFilteredCategories();

  const handleSubmit = async (values: BatchEditFormValues) => {
    const updates: any = {};

    if (values.updateDate && values.data) {
      updates.data = format(values.data, 'yyyy-MM-dd');
    }

    if (values.updateCategory && values.categoria) {
      updates.categoria = values.categoria;
    }

    if (values.updateDescription && values.descrição) {
      updates.descrição = values.descrição;
    }

    await onSubmit(updates);
    form.reset();
  };

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edição em lote</DialogTitle>
          <DialogDescription>
            Edite múltiplas transações ao mesmo tempo. Apenas os campos marcados serão atualizados.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 py-2">
            <div className="space-y-5">
              {/* Campo de data */}
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="updateDate"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label>Atualizar data</Label>
                    </FormItem>
                  )}
                />
              </div>

              {updateDate && (
                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Nova data</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            locale={ptBR}
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Campo de categoria */}
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="updateCategory"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label>Atualizar categoria</Label>
                    </FormItem>
                  )}
                />
              </div>

              {updateCategory && (
                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova categoria</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoadingCategories}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredCategories.map((category) => (
                            <SelectItem key={category.id} value={category.nome}>
                              {category.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Campo de descrição */}
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="updateDescription"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label>Atualizar descrição</Label>
                    </FormItem>
                  )}
                />
              </div>

              {updateDescription && (
                <FormField
                  control={form.control}
                  name="descrição"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova descrição</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Digite a nova descrição" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={
                  (!updateDate || !form.getValues('data')) &&
                  (!updateCategory || !form.getValues('categoria')) &&
                  (!updateDescription || !form.getValues('descrição'))
                }
              >
                Atualizar {selectedTransactions.length} transações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
