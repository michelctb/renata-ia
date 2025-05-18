
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CopyIcon } from 'lucide-react';
import { copyMetasFromPreviousPeriod } from '@/lib/metas';

interface CopyMetasButtonProps {
  userId: string;
  onCopySuccess: () => void;
  targetMonth: number; // Mês para o qual estamos copiando
  targetYear: number;  // Ano para o qual estamos copiando
}

type CopyFormValues = {
  sourceMonth: string;
  sourceYear: string;
};

export const CopyMetasButton: React.FC<CopyMetasButtonProps> = ({ 
  userId, 
  onCopySuccess,
  targetMonth,
  targetYear
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<CopyFormValues>({
    defaultValues: {
      sourceMonth: (targetMonth === 1 ? '12' : String(targetMonth - 1)).padStart(2, '0'),
      sourceYear: targetMonth === 1 ? String(targetYear - 1) : String(targetYear)
    }
  });
  
  // Gerar os últimos 12 meses como opções
  const monthOptions = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(targetYear, targetMonth - i - 2);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    monthOptions.push({
      label: `${month.toString().padStart(2, '0')}/${year}`,
      monthValue: month.toString().padStart(2, '0'),
      yearValue: year.toString()
    });
  }
  
  const handleSubmit = async (values: CopyFormValues) => {
    if (!userId) return;
    
    const sourceMes = parseInt(values.sourceMonth);
    const sourceAno = parseInt(values.sourceYear);
    
    setIsLoading(true);
    try {
      await copyMetasFromPreviousPeriod(
        userId, 
        sourceMes, 
        sourceAno, 
        targetMonth, 
        targetYear
      );
      
      toast.success('Metas copiadas com sucesso!');
      onCopySuccess();
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao copiar metas:', error);
      toast.error('Erro ao copiar metas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="outline"
        className="flex gap-2 items-center"
      >
        <CopyIcon className="h-4 w-4" />
        Copiar metas anteriores
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Copiar metas de período anterior</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="sourceMonth"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel>Selecione o mês de origem</FormLabel>
                    <Select
                      value={`${field.value}-${form.getValues('sourceYear')}`}
                      onValueChange={(value) => {
                        const [month, year] = value.split('-');
                        form.setValue('sourceMonth', month);
                        form.setValue('sourceYear', year);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o mês" />
                      </SelectTrigger>
                      <SelectContent>
                        {monthOptions.map((option) => (
                          <SelectItem 
                            key={`${option.monthValue}-${option.yearValue}`}
                            value={`${option.monthValue}-${option.yearValue}`}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Copiando...' : 'Copiar metas'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
