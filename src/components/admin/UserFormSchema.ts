import { z } from 'zod';

// Country codes with flags for phone numbers
export const countries = [
  { code: '55', label: 'Brasil', flag: '🇧🇷' },
  { code: '1', label: 'Estados Unidos', flag: '🇺🇸' },
  { code: '351', label: 'Portugal', flag: '🇵🇹' },
  { code: '34', label: 'Espanha', flag: '🇪🇸' },
  { code: '54', label: 'Argentina', flag: '🇦🇷' },
  { code: '598', label: 'Uruguai', flag: '🇺🇾' },
  { code: '44', label: 'Reino Unido', flag: '🇬🇧' },
  { code: '49', label: 'Alemanha', flag: '🇩🇪' },
  { code: '33', label: 'França', flag: '🇫🇷' },
  { code: '39', label: 'Itália', flag: '🇮🇹' },
];

// Form schema for user management
export const userFormSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  countryCode: z.string().default('55'),
  phoneNumber: z.string().min(8, 'Número de telefone inválido'),
  email: z.string().email('E-mail inválido').optional().nullable(),
  cpf: z.string().min(11, 'CPF inválido').max(14).optional().nullable(),
  ativo: z.boolean().default(true),
  plano: z.string().optional().nullable(),
  perfil: z.union([z.enum(['user', 'adm', 'consultor']), z.string()]).default('user'),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

// Helper function to parse phone number
export const parsePhoneNumber = (phone: string | undefined) => {
  if (!phone) return { countryCode: '55', phoneNumber: '' };
  
  // Check if it's in WhatsApp format
  if (phone.includes('@s.whatsapp.net')) {
    phone = phone.split('@')[0];
  }
  
  // Try to extract country code
  for (const country of countries) {
    if (phone.startsWith(country.code)) {
      return {
        countryCode: country.code,
        phoneNumber: phone.substring(country.code.length)
      };
    }
  }
  
  // Default if no country code is found
  return { countryCode: '55', phoneNumber: phone };
};

// Format data for saving
export const formatUserDataForSaving = (values: UserFormValues, userToEdit: any) => {
  // Format phone number for WhatsApp
  const telefone = `${values.countryCode}${values.phoneNumber}@s.whatsapp.net`;
  
  // Format CPF as number if provided
  const cpf = values.cpf ? Number(values.cpf.replace(/\D/g, '')) : null;
  
  // Prepare user data for saving
  return {
    ...userToEdit,
    nome: values.nome,
    telefone,
    email: values.email || null,
    cpf,
    ativo: values.ativo,
    plano: values.plano || null,
    perfil: values.perfil,
  };
};
