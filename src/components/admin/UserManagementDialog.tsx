
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Cliente } from '@/lib/clientes';
import UserFormContent from './user-form/UserFormContent';
import { useUserFormManagement } from '@/hooks/admin/useUserFormManagement';

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
  const { form, processFormData } = useUserFormManagement(userToEdit);

  const handleSubmit = (values: any) => {
    const userData = processFormData(values);
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
        
        <UserFormContent 
          form={form}
          onSubmit={handleSubmit}
          onClose={onClose}
          isAdminMode={isAdminMode}
          isEditing={!!userToEdit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementDialog;
