
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';

const AdminFields = () => {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="plano"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plano</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value || 'Mensal'}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Mensal">Mensal</SelectItem>
                <SelectItem value="Semestral">Semestral</SelectItem>
                <SelectItem value="Anual">Anual</SelectItem>
                <SelectItem value="Consultor">Consultor</SelectItem>
                <SelectItem value="Consultorado">Consultorado</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="perfil"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Perfil</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um perfil" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="user">Usuário</SelectItem>
                <SelectItem value="consultor">Consultor</SelectItem>
                <SelectItem value="adm">Administrador</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AdminFields;
