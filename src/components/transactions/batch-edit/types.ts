
import { z } from 'zod';

// Schema para validação do formulário
export const batchEditSchema = z.object({
  updateDate: z.boolean().default(false),
  data: z.date().optional(),
  updateCategory: z.boolean().default(false),
  categoria: z.string().optional(),
  updateDescription: z.boolean().default(false),
  descrição: z.string().optional(),
});

export type BatchEditFormValues = z.infer<typeof batchEditSchema>;
