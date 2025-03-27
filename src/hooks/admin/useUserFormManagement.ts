
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Cliente } from '@/lib/clientes';
import { userFormSchema, UserFormValues, parsePhoneNumber, formatUserDataForSaving } from '@/components/admin/UserFormSchema';

export const useUserFormManagement = (userToEdit: Cliente | null) => {
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
      adesao: 0,
      recorrencia: 0,
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
        adesao: userToEdit.adesao !== undefined ? Number(userToEdit.adesao) : 0,
        recorrencia: userToEdit.recorrencia !== undefined ? Number(userToEdit.recorrencia) : 0,
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
        adesao: 0,
        recorrencia: 0,
      });
    }
  }, [userToEdit, form]);

  const processFormData = (values: UserFormValues) => {
    return formatUserDataForSaving(values, userToEdit);
  };

  return { form, processFormData };
};
