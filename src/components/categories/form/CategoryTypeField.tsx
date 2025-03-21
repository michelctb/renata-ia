
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InfoIcon } from 'lucide-react';
import { Control } from 'react-hook-form';
import { CategoryFormValues } from '../categoryFormSchema';

interface CategoryTypeFieldProps {
  control: Control<CategoryFormValues>;
  isPadraoCategory: boolean;
}

export function CategoryTypeField({ control, isPadraoCategory }: CategoryTypeFieldProps) {
  return (
    <FormField
      control={control}
      name="tipo"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            value={field.value}
            disabled={isPadraoCategory}
          >
            <FormControl>
              <SelectTrigger className={isPadraoCategory ? "bg-muted" : ""}>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="entrada">Entrada</SelectItem>
              <SelectItem value="saída">Saída</SelectItem>
              <SelectItem value="ambos">Ambos</SelectItem>
            </SelectContent>
          </Select>
          {isPadraoCategory && (
            <FormDescription className="flex items-center text-amber-600">
              <InfoIcon className="h-4 w-4 mr-1" />
              O tipo não pode ser alterado em categorias padrão
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
