
// Tipo para metas de categoria
export type MetaCategoria = {
  id?: number;
  id_cliente: string;
  categoria: string;
  valor_meta: number;
  periodo: 'mensal' | 'trimestral' | 'anual';
  mes_referencia?: number;
  ano_referencia?: number;
  created_at?: string;
};

// Tipo para progresso da meta
export type MetaProgresso = {
  meta: MetaCategoria;
  valor_atual: number;
  porcentagem: number;
  status: 'baixo' | 'médio' | 'alto' | 'excedido';
};
