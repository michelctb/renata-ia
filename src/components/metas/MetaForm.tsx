
import { useState } from 'react';
import { Form } from "@/components/ui/form";
import { MetaCategoria } from '@/lib/metas/types';
import { toast } from 'sonner';
import { useMetaForm } from './hooks/useMetaForm';
import { MetaBasicFields } from './components/MetaBasicFields';
import { PeriodSelectors } from './components/PeriodSelectors';
import { MetaFormFooter } from './components/MetaFormFooter';
import { CategoryWithMeta } from '@/hooks/useCategoriesWithMetas';

interface MetaFormProps {
  userId: string;
  metaAtual: MetaCategoria | null;
  onSubmit: (meta: MetaCategoria) => Promise<void>;
  onCancel: () => void;
  availableCategories: CategoryWithMeta[];
}

export function MetaForm({ userId, metaAtual, onSubmit, onCancel, availableCategories }: MetaFormProps) {
  const {
    form,
    periodoSelecionado,
    prepareMetaForSubmit
  } = useMetaForm(userId, metaAtual, availableCategories);
  
  const handleSubmit = async (values: any) => {
    try {
      const meta = prepareMetaForSubmit(values);
      await onSubmit(meta);
      form.reset();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      toast.error('Erro ao salvar meta');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <MetaBasicFields 
          form={form} 
          availableCategories={availableCategories} 
        />
        
        <PeriodSelectors 
          form={form} 
          periodoSelecionado={periodoSelecionado} 
        />
        
        <MetaFormFooter 
          onCancel={onCancel} 
          metaAtual={metaAtual} 
        />
      </form>
    </Form>
  );
}
