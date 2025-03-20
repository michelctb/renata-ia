
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { LembreteFormValues } from './lembreteFormSchema';

interface LembreteDatePickerProps {
  form: UseFormReturn<LembreteFormValues>;
}

export function LembreteDatePicker({ form }: LembreteDatePickerProps) {
  // Log the current date value for debugging
  const currentDate = form.watch('vencimento');
  console.log('Current date in LembreteDatePicker:', currentDate);
  
  return (
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
                onSelect={(date) => {
                  if (date) {
                    // Normalizar a data selecionada para meio-dia para evitar problemas de fuso horário
                    const normalizedDate = new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate(),
                      12, 0, 0
                    );
                    console.log('Selected date:', date);
                    console.log('Normalized date:', normalizedDate);
                    field.onChange(normalizedDate);
                  } else {
                    field.onChange(undefined);
                  }
                }}
                locale={ptBR}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
