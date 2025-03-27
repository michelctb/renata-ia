
import React from 'react';
import BaseUserFields from './user-form/BaseUserFields';
import ConsultorFields from './user-form/ConsultorFields';
import AdminFields from './user-form/AdminFields';
import StatusToggle from './user-form/StatusToggle';

interface UserFormFieldsProps {
  isAdminMode: boolean;
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({ isAdminMode }) => {
  return (
    <div className="space-y-4">
      <BaseUserFields />
      
      {/* Campos de Adesão e Recorrência - apenas para consultores (não-admin) */}
      {!isAdminMode && <ConsultorFields />}
      
      {/* Somente mostrar seleção de plano para administradores */}
      {isAdminMode && <AdminFields />}
      
      <StatusToggle />
    </div>
  );
};

export default UserFormFields;
