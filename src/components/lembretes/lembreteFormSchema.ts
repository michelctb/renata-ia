
import { z } from 'zod';

export const lembreteSchema = z.object({
  id: z.number().optional(),
  lembrete: z.string().min(1, "Descrição é obrigatória"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  valor: z.coerce.number().optional(),
  vencimento: z.date({
    required_error: "Data de vencimento é obrigatória",
  }),
});

export type LembreteFormValues = z.infer<typeof lembreteSchema>;
