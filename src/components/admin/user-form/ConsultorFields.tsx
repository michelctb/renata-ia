
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

const ConsultorFields = () => {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="adesao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor de Adesão (R$)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01"
                min="0"
                placeholder="0.00" 
                {...field} 
                value={field.value === undefined ? '0' : field.value}
                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="recorrencia"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor Recorrência (R$)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01"
                min="0"
                placeholder="0.00" 
                {...field} 
                value={field.value === undefined ? '0' : field.value}
                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ConsultorFields;
