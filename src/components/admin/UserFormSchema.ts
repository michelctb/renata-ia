
import { z } from 'zod';

// Country codes with flags for phone numbers
export const countries = [
  // Países de língua portuguesa primeiro
  { code: '55', label: 'Brasil', flag: '🇧🇷' },
  { code: '351', label: 'Portugal', flag: '🇵🇹' },
  { code: '244', label: 'Angola', flag: '🇦🇴' },
  { code: '258', label: 'Moçambique', flag: '🇲🇿' },
  
  // Outros países em ordem alfabética
  { code: '93', label: 'Afeganistão', flag: '🇦🇫' },
  { code: '27', label: 'África do Sul', flag: '🇿🇦' },
  { code: '355', label: 'Albânia', flag: '🇦🇱' },
  { code: '49', label: 'Alemanha', flag: '🇩🇪' },
  { code: '376', label: 'Andorra', flag: '🇦🇩' },
  { code: '966', label: 'Arábia Saudita', flag: '🇸🇦' },
  { code: '54', label: 'Argentina', flag: '🇦🇷' },
  { code: '213', label: 'Argélia', flag: '🇩🇿' },
  { code: '61', label: 'Austrália', flag: '🇦🇺' },
  { code: '43', label: 'Áustria', flag: '🇦🇹' },
  { code: '1242', label: 'Bahamas', flag: '🇧🇸' },
  { code: '973', label: 'Bahrein', flag: '🇧🇭' },
  { code: '880', label: 'Bangladesh', flag: '🇧🇩' },
  { code: '1246', label: 'Barbados', flag: '🇧🇧' },
  { code: '32', label: 'Bélgica', flag: '🇧🇪' },
  { code: '501', label: 'Belize', flag: '🇧🇿' },
  { code: '591', label: 'Bolívia', flag: '🇧🇴' },
  { code: '387', label: 'Bósnia e Herzegovina', flag: '🇧🇦' },
  { code: '267', label: 'Botsuana', flag: '🇧🇼' },
  { code: '359', label: 'Bulgária', flag: '🇧🇬' },
  { code: '855', label: 'Camboja', flag: '🇰🇭' },
  { code: '1', label: 'Canadá', flag: '🇨🇦' },
  { code: '974', label: 'Catar', flag: '🇶🇦' },
  { code: '56', label: 'Chile', flag: '🇨🇱' },
  { code: '86', label: 'China', flag: '🇨🇳' },
  { code: '357', label: 'Chipre', flag: '🇨🇾' },
  { code: '57', label: 'Colômbia', flag: '🇨🇴' },
  { code: '82', label: 'Coreia do Sul', flag: '🇰🇷' },
  { code: '506', label: 'Costa Rica', flag: '🇨🇷' },
  { code: '385', label: 'Croácia', flag: '🇭🇷' },
  { code: '53', label: 'Cuba', flag: '🇨🇺' },
  { code: '45', label: 'Dinamarca', flag: '🇩🇰' },
  { code: '20', label: 'Egito', flag: '🇪🇬' },
  { code: '503', label: 'El Salvador', flag: '🇸🇻' },
  { code: '971', label: 'Emirados Árabes Unidos', flag: '🇦🇪' },
  { code: '593', label: 'Equador', flag: '🇪🇨' },
  { code: '34', label: 'Espanha', flag: '🇪🇸' },
  { code: '1', label: 'Estados Unidos', flag: '🇺🇸' },
  { code: '372', label: 'Estônia', flag: '🇪🇪' },
  { code: '251', label: 'Etiópia', flag: '🇪🇹' },
  { code: '63', label: 'Filipinas', flag: '🇵🇭' },
  { code: '358', label: 'Finlândia', flag: '🇫🇮' },
  { code: '33', label: 'França', flag: '🇫🇷' },
  { code: '233', label: 'Gana', flag: '🇬🇭' },
  { code: '30', label: 'Grécia', flag: '🇬🇷' },
  { code: '502', label: 'Guatemala', flag: '🇬🇹' },
  { code: '509', label: 'Haiti', flag: '🇭🇹' },
  { code: '31', label: 'Holanda', flag: '🇳🇱' },
  { code: '504', label: 'Honduras', flag: '🇭🇳' },
  { code: '852', label: 'Hong Kong', flag: '🇭🇰' },
  { code: '36', label: 'Hungria', flag: '🇭🇺' },
  { code: '91', label: 'Índia', flag: '🇮🇳' },
  { code: '62', label: 'Indonésia', flag: '🇮🇩' },
  { code: '98', label: 'Irã', flag: '🇮🇷' },
  { code: '964', label: 'Iraque', flag: '🇮🇶' },
  { code: '353', label: 'Irlanda', flag: '🇮🇪' },
  { code: '354', label: 'Islândia', flag: '🇮🇸' },
  { code: '972', label: 'Israel', flag: '🇮🇱' },
  { code: '39', label: 'Itália', flag: '🇮🇹' },
  { code: '1876', label: 'Jamaica', flag: '🇯🇲' },
  { code: '81', label: 'Japão', flag: '🇯🇵' },
  { code: '962', label: 'Jordânia', flag: '🇯🇴' },
  { code: '254', label: 'Quênia', flag: '🇰🇪' },
  { code: '965', label: 'Kuwait', flag: '🇰🇼' },
  { code: '371', label: 'Letônia', flag: '🇱🇻' },
  { code: '961', label: 'Líbano', flag: '🇱🇧' },
  { code: '218', label: 'Líbia', flag: '🇱🇾' },
  { code: '370', label: 'Lituânia', flag: '🇱🇹' },
  { code: '352', label: 'Luxemburgo', flag: '🇱🇺' },
  { code: '853', label: 'Macau', flag: '🇲🇴' },
  { code: '389', label: 'Macedônia do Norte', flag: '🇲🇰' },
  { code: '60', label: 'Malásia', flag: '🇲🇾' },
  { code: '356', label: 'Malta', flag: '🇲🇹' },
  { code: '212', label: 'Marrocos', flag: '🇲🇦' },
  { code: '52', label: 'México', flag: '🇲🇽' },
  { code: '95', label: 'Myanmar (Birmânia)', flag: '🇲🇲' },
  { code: '977', label: 'Nepal', flag: '🇳🇵' },
  { code: '505', label: 'Nicarágua', flag: '🇳🇮' },
  { code: '234', label: 'Nigéria', flag: '🇳🇬' },
  { code: '47', label: 'Noruega', flag: '🇳🇴' },
  { code: '64', label: 'Nova Zelândia', flag: '🇳🇿' },
  { code: '968', label: 'Omã', flag: '🇴🇲' },
  { code: '92', label: 'Paquistão', flag: '🇵🇰' },
  { code: '507', label: 'Panamá', flag: '🇵🇦' },
  { code: '595', label: 'Paraguai', flag: '🇵🇾' },
  { code: '51', label: 'Peru', flag: '🇵🇪' },
  { code: '48', label: 'Polônia', flag: '🇵🇱' },
  { code: '44', label: 'Reino Unido', flag: '🇬🇧' },
  { code: '1809', label: 'República Dominicana', flag: '🇩🇴' },
  { code: '40', label: 'Romênia', flag: '🇷🇴' },
  { code: '7', label: 'Rússia', flag: '🇷🇺' },
  { code: '221', label: 'Senegal', flag: '🇸🇳' },
  { code: '381', label: 'Sérvia', flag: '🇷🇸' },
  { code: '65', label: 'Singapura', flag: '🇸🇬' },
  { code: '963', label: 'Síria', flag: '🇸🇾' },
  { code: '252', label: 'Somália', flag: '🇸🇴' },
  { code: '94', label: 'Sri Lanka', flag: '🇱🇰' },
  { code: '46', label: 'Suécia', flag: '🇸🇪' },
  { code: '41', label: 'Suíça', flag: '🇨🇭' },
  { code: '66', label: 'Tailândia', flag: '🇹🇭' },
  { code: '886', label: 'Taiwan', flag: '🇹🇼' },
  { code: '255', label: 'Tanzânia', flag: '🇹🇿' },
  { code: '216', label: 'Tunísia', flag: '🇹🇳' },
  { code: '90', label: 'Turquia', flag: '🇹🇷' },
  { code: '380', label: 'Ucrânia', flag: '🇺🇦' },
  { code: '598', label: 'Uruguai', flag: '🇺🇾' },
  { code: '58', label: 'Venezuela', flag: '🇻🇪' },
  { code: '84', label: 'Vietnã', flag: '🇻🇳' },
  { code: '260', label: 'Zâmbia', flag: '🇿🇲' },
  { code: '263', label: 'Zimbábue', flag: '🇿🇼' },
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
