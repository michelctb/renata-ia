
import { useState } from 'react';
import { Form } from "@/components/ui/form";
import { MetaCategoria } from '@/lib/metas/types';
import { toast } from 'sonner';
import { useMetaForm } from './hooks/useMetaForm';
import { MetaBasicFields } from './components/MetaBasicFields';
import { PeriodSelectors } from './components/PeriodSelectors';
import { MetaFormFooter } from './components/MetaFormFooter';

interface MetaFormProps {
  userId: string;
  metaAtual: MetaCategoria | null;
  onSubmit: (meta: MetaCategoria) => Promise<void>;
  onCancel: () => void;
}

export function MetaForm({ userId, metaAtual, onSubmit, onCancel }: MetaFormProps) {
  const {
    form,
    categorias,
    periodoSelecionado,
    prepareMetaForSubmit
  } = useMetaForm(userId, metaAtual);
  
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
        <MetaBasicFields form={form} categorias={categorias} />
        
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
