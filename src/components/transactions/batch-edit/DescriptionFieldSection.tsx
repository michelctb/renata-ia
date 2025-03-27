
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { BatchEditFormValues } from './types';

interface DescriptionFieldSectionProps {
  form: {
    control: Control<BatchEditFormValues>;
    getValues: (field?: string) => any;
  };
  updateDescription: boolean;
}

export function DescriptionFieldSection({ form, updateDescription }: DescriptionFieldSectionProps) {
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
