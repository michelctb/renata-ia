
import { Control } from 'react-hook-form';
import { Category } from '@/lib/categories';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BatchEditFormValues } from './types';

interface CategoryFieldSectionProps {
  form: {
    control: Control<BatchEditFormValues>;
    getValues: (field?: string) => any;
  };
  updateCategory: boolean;
  filteredCategories: Category[];
  isLoadingCategories: boolean;
}

export function CategoryFieldSection({ 
  form, 
  updateCategory, 
  filteredCategories, 
  isLoadingCategories 
}: CategoryFieldSectionProps) {
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
