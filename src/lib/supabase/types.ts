
// Types for financial records
export type Transaction = {
  id?: number;
  cliente?: string; // Mantido para compatibilidade
  id_cliente: string; // Novo campo para identificar o cliente
  created_at?: string;
  data: string;
  operação: 'entrada' | 'saída';
  descrição: string;
  categoria: string;
  valor: number;
};
