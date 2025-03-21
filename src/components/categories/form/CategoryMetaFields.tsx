
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Control, useWatch } from 'react-hook-form';
import { CategoryFormValues } from '../categoryFormSchema';

interface CategoryMetaFieldsProps {
  control: Control<CategoryFormValues>;
}

export function CategoryMetaFields({ control }: CategoryMetaFieldsProps) {
  const hasMetaValue = useWatch({
    control,
    name: "hasMeta",
  });

  return (
    <>
      <FormField
        control={control}
        name="hasMeta"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Definir meta de gastos</FormLabel>
              <FormDescription>
                Marque esta opção para definir uma meta de gastos para esta categoria
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      
      {hasMetaValue && (
        <FormField
          control={control}
          name="valorMeta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da Meta (R$)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.valueAsNumber || 0);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}
