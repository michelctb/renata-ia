
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
  selected?: boolean; // Novo campo para controlar seleção múltipla
};

// Type for client records
export type Cliente = {
  id_cliente: string;
  nome?: string;
  telefone?: string;
  email?: string;
  cpf?: number;
  ativo?: boolean;
  plano?: string;
  lembrete?: string;
  perfil?: 'user' | 'adm' | 'consultor' | string;
  consultor?: string;
  created_at?: string;
  valor?: number;
};
