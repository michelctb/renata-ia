
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Transaction } from '@/lib/supabase/types';
import { Category } from '@/lib/categories';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { DateFieldSection } from './DateFieldSection';
import { CategoryFieldSection } from './CategoryFieldSection';
import { DescriptionFieldSection } from './DescriptionFieldSection';
import { batchEditSchema, BatchEditFormValues } from './types';

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

// Usando export type para re-exportar o tipo
export type { BatchEditFormValues };
