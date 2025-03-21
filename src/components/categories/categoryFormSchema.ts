
import { z } from 'zod';

// Schema for category form validation
export const categoryFormSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.',
  }),
  tipo: z.enum(['entrada', 'saída', 'ambos']),
  hasMeta: z.boolean().default(false),
  valorMeta: z.number().optional()
    .refine(val => !val || val > 0, {
      message: "O valor da meta deve ser maior que zero",
    }),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
