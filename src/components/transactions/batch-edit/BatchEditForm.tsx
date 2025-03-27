
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Transaction } from '@/lib/supabase/types';
import { Category } from '@/lib/categories';
import { cn } from '@/lib/utils';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DialogFooter } from '@/components/ui/dialog';

// Schema para validação do formulário
const batchEditSchema = z.object({
  updateDate: z.boolean().default(false),
  data: z.date().optional(),
  updateCategory: z.boolean().default(false),
  categoria: z.string().optional(),
  updateDescription: z.boolean().default(false),
  descrição: z.string().optional(),
});

export type BatchEditFormValues = z.infer<typeof batchEditSchema>;

interface BatchEditFormProps {
  onSubmit: (values: BatchEditFormValues) => Promise<void>;
  onCancel: () => void;
  selectedTransactions: Transaction[];
  categories: Category[];
  isLoadingCategories: boolean;
}

export function BatchEditForm({
  onSubmit,
  onCancel,
  selectedTransactions,
  categories,
  isLoadingCategories,
}: BatchEditFormProps) {
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

    // Verificamos se todas as transações são do mesmo tipo e têm o campo operação definido
    const validTransactions = selectedTransactions.filter(t => t.operação !== undefined);
    
    if (validTransactions.length === 0) return categories;
    
    const allSameType = validTransactions.every(
      t => t.operação === validTransactions[0].operação
    );

    if (allSameType && validTransactions.length > 0) {
      const operationType = validTransactions[0].operação.toLowerCase();
      return categories.filter(
        cat => cat.tipo === 'ambos' || cat.tipo.toLowerCase() === operationType
      );
    }

    // Se existirem tipos misturados ou indefinidos, exibimos apenas categorias "ambos"
    return categories.filter(cat => cat.tipo === 'ambos');
  };

  const filteredCategories = getFilteredCategories();

  const handleSubmit = async (values: BatchEditFormValues) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 py-2">
        <div className="space-y-5">
          {/* Campo de data */}
          <DateFieldSection
            form={form}
            updateDate={updateDate}
          />

          {/* Campo de categoria */}
          <CategoryFieldSection
            form={form}
            updateCategory={updateCategory}
            filteredCategories={filteredCategories}
            isLoadingCategories={isLoadingCategories}
          />

          {/* Campo de descrição */}
          <DescriptionFieldSection
            form={form}
            updateDescription={updateDescription}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
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
  );
}

// Componente para a seção do campo de data
function DateFieldSection({ form, updateDate }) {
  return (
    <>
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
              <FormLabel className="m-0">Atualizar data</FormLabel>
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
    </>
  );
}

// Componente para a seção do campo de categoria
function CategoryFieldSection({ form, updateCategory, filteredCategories, isLoadingCategories }) {
  return (
    <>
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
              <FormLabel className="m-0">Atualizar categoria</FormLabel>
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
    </>
  );
}

// Componente para a seção do campo de descrição
function DescriptionFieldSection({ form, updateDescription }) {
  return (
    <>
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
              <FormLabel className="m-0">Atualizar descrição</FormLabel>
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
    </>
  );
}
