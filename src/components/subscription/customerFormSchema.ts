
import { z } from "zod";

// Form schema
export const customerFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  cpfCnpj: z.string().min(11, "CPF deve ter 11 dígitos").max(14, "CNPJ deve ter 14 dígitos"),
  email: z.string().email("E-mail inválido"),
  mobilePhone: z.string().min(10, "Celular deve ter pelo menos 10 dígitos")
});

// This ensures the customer data matches exactly what the API expects
export type CustomerFormValues = z.infer<typeof customerFormSchema>;
