
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InfoIcon } from 'lucide-react';
import { Control } from 'react-hook-form';
import { CategoryFormValues } from '../categoryFormSchema';

interface CategoryNameFieldProps {
  control: Control<CategoryFormValues>;
  isPadraoCategory: boolean;
}

export function CategoryNameField({ control, isPadraoCategory }: CategoryNameFieldProps) {
  return (
    <FormField
      control={control}
      name="nome"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome</FormLabel>
          <FormControl>
            <Input 
              placeholder="Nome da categoria" 
              {...field} 
              disabled={isPadraoCategory}
              className={isPadraoCategory ? "bg-muted" : ""}
            />
          </FormControl>
          {isPadraoCategory && (
            <FormDescription className="flex items-center text-amber-600">
              <InfoIcon className="h-4 w-4 mr-1" />
              O nome não pode ser alterado em categorias padrão
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
