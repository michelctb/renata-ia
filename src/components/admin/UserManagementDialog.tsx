
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Cliente } from '@/lib/clientes';
import UserFormFields from './UserFormFields';
import { userFormSchema, UserFormValues, parsePhoneNumber, formatUserDataForSaving } from './UserFormSchema';

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
      nome: '',
      countryCode: '55',
      phoneNumber: '',
      email: '',
      cpf: '',
      ativo: true,
      plano: 'Mensal',
      perfil: 'user',
    },
  });

  // Atualizar o formulário quando userToEdit mudar
  useEffect(() => {
    if (userToEdit) {
      const { countryCode, phoneNumber } = parsePhoneNumber(userToEdit.telefone);
      
      form.reset({
        nome: userToEdit.nome || '',
        countryCode,
        phoneNumber,
        email: userToEdit.email || '',
        cpf: userToEdit.cpf ? String(userToEdit.cpf) : '',
        ativo: userToEdit.ativo !== undefined ? userToEdit.ativo : true,
        plano: userToEdit.plano || 'Mensal',
        perfil: userToEdit.perfil || 'user',
      });
    } else {
      form.reset({
        nome: '',
        countryCode: '55',
        phoneNumber: '',
        email: '',
        cpf: '',
        ativo: true,
        plano: 'Mensal',
        perfil: 'user',
      });
    }
  }, [userToEdit, form]);

  const onSubmit = (values: UserFormValues) => {
    const userData = formatUserDataForSaving(values, userToEdit);
    onSave(userData);
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
            <UserFormFields isAdminMode={isAdminMode} />
            
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
