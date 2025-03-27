
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import CountryCodeSelector from './CountryCodeSelector';
import { useFormContext } from 'react-hook-form';

interface UserFormFieldsProps {
  isAdminMode: boolean;
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({ isAdminMode }) => {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input placeholder="Nome completo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={control}
          name="countryCode"
          render={() => <CountryCodeSelector name="countryCode" />}
        />
        
        <FormField
          control={control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="99999-9999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input 
                  placeholder="email@exemplo.com" 
                  type="email" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input 
                  placeholder="000.000.000-00" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Campos de Adesão e Recorrência - apenas para consultores (não-admin) */}
      {!isAdminMode && (
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
      )}
      
      {/* Somente mostrar seleção de plano para administradores */}
      {isAdminMode && (
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
      )}
      
      <FormField
        control={control}
        name="ativo"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel>Status da Conta</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default UserFormFields;
