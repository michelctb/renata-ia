
// Types for categories
export type Category = {
  id?: number;
  nome: string;
  tipo: 'entrada' | 'saída' | 'ambos';
  cliente: string;
  created_at?: string;
  padrao?: boolean;
};
