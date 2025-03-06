
import { supabase } from './supabase';

// Tipo para representar uma categoria
export type Category = {
  id?: number;
  nome: string;
  tipo: 'entrada' | 'saída' | 'ambos';
  cliente: string;
  created_at?: string;
};

// Nome da tabela de categorias
const CATEGORIES_TABLE = 'Categorias';

// Buscar todas as categorias de um usuário
export async function fetchCategories(userId: string) {
  const { data, error } = await supabase
    .from(CATEGORIES_TABLE)
    .select('*')
    .eq('cliente', userId)
    .order('nome');

  if (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }

  return data || [];
}

// Adicionar uma nova categoria
export async function addCategory(category: Category) {
  const { data, error } = await supabase
    .from(CATEGORIES_TABLE)
    .insert([category])
    .select();

  if (error) {
    console.error('Erro ao adicionar categoria:', error);
    throw error;
  }

  return data?.[0];
}

// Atualizar uma categoria existente
export async function updateCategory(category: Category) {
  const { data, error } = await supabase
    .from(CATEGORIES_TABLE)
    .update(category)
    .eq('id', category.id)
    .select();

  if (error) {
    console.error('Erro ao atualizar categoria:', error);
    throw error;
  }

  return data?.[0];
}

// Excluir uma categoria
export async function deleteCategory(id: number) {
  const { error } = await supabase
    .from(CATEGORIES_TABLE)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir categoria:', error);
    throw error;
  }

  return true;
}
