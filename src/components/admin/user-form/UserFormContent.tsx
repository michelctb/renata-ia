
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { UserFormValues } from '../UserFormSchema';
import UserFormFields from '../UserFormFields';
import { UseFormReturn } from 'react-hook-form';

interface UserFormContentProps {
  form: UseFormReturn<UserFormValues>;
  onSubmit: (values: UserFormValues) => void;
  onClose: () => void;
  isAdminMode: boolean;
  isEditing: boolean;
}

const UserFormContent: React.FC<UserFormContentProps> = ({
  form,
  onSubmit,
  onClose,
  isAdminMode,
  isEditing
}) => {
  return (
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
            {isEditing ? 'Atualizar' : 'Adicionar'} Usuário
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UserFormContent;
