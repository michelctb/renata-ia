
import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cliente } from '@/lib/clientes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const userFormSchema = z.object({
  id_cliente: z.string().min(1, 'ID é obrigatório'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  telefone: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().nullable(),
  cpf: z.coerce.number().optional().nullable(),
  ativo: z.boolean().default(true),
  plano: z.string().optional().nullable(),
  perfil: z.union([z.enum(['user', 'adm', 'consultor']), z.string()]).default('user'),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Cliente) => void;
  userToEdit: Cliente | null;
  isAdminMode: boolean;
}

const UserManagementDialog: React.FC<UserManagementDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  userToEdit,
  isAdminMode,
}) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      id_cliente: '',
      nome: '',
      telefone: '',
      email: '',
      cpf: null,
      ativo: true,
      plano: 'Mensal',
      perfil: 'user',
    },
  });

  // Atualizar o formulário quando userToEdit mudar
  useEffect(() => {
    if (userToEdit) {
      form.reset({
        id_cliente: userToEdit.id_cliente,
        nome: userToEdit.nome || '',
        telefone: userToEdit.telefone || '',
        email: userToEdit.email || '',
        cpf: userToEdit.cpf || null,
        ativo: userToEdit.ativo !== undefined ? userToEdit.ativo : true,
        plano: userToEdit.plano || 'Mensal',
        perfil: userToEdit.perfil || 'user',
      });
    } else {
      form.reset({
        id_cliente: '',
        nome: '',
        telefone: '',
        email: '',
        cpf: null,
        ativo: true,
        plano: 'Mensal',
        perfil: 'user',
      });
    }
  }, [userToEdit, form]);

  const onSubmit = (values: UserFormValues) => {
    onSave(values as Cliente);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {userToEdit ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id_cliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID do Cliente</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ID único do cliente" 
                      {...field} 
                      disabled={!!userToEdit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
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
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
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
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {isAdminMode && (
                <FormField
                  control={form.control}
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
              )}
            </div>
            
            <FormField
              control={form.control}
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
            
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {userToEdit ? 'Atualizar' : 'Adicionar'} Usuário
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementDialog;
