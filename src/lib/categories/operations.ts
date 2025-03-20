
import { supabase } from '../supabase';
import { Category } from './types';
import { CATEGORIES_TABLE } from './constants';

// Fetch all categories for a user
export async function fetchCategories(userId: string) {
  console.log('Fetching categories for user:', userId);
  
  const { data, error } = await supabase
    .from(CATEGORIES_TABLE)
    .select('*')
    .or(`padrao.eq.true,cliente.eq.${userId}`)
    .order('nome');

  if (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }

  return data || [];
}

// Add a new category
export async function addCategory(category: Category) {
  console.log('Adding category with data:', category);
  
  // Certifique-se de que categoria tem os campos necessários
  if (!category.nome || !category.tipo || !category.cliente) {
    console.error('Dados de categoria incompletos:', category);
    throw new Error('Dados de categoria incompletos');
  }
  
  // Certifique-se de que a categoria não é marcada como padrão
  const newCategory = {
    nome: category.nome,
    tipo: category.tipo,
    cliente: category.cliente,
    padrao: false
  };
  
  console.log('Sending to database:', newCategory);
  
  const { data, error } = await supabase
    .from(CATEGORIES_TABLE)
    .insert([newCategory])
    .select();

  if (error) {
    console.error('Erro ao adicionar categoria:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('Nenhum dado retornado após inserção');
  }

  console.log('Category added successfully:', data[0]);
  return data[0];
}

// Update an existing category
export async function updateCategory(category: Category) {
  console.log('Updating category:', category);
  
  // Verificar se é uma categoria padrão
  if (category.padrao) {
    console.error('Categorias padrão não podem ser editadas');
    throw new Error('Categorias padrão não podem ser editadas');
  }

  // Verificar se tem ID
  if (!category.id) {
    console.error('ID da categoria é necessário para atualização');
    throw new Error('ID da categoria é necessário para atualização');
  }

  const { data, error } = await supabase
    .from(CATEGORIES_TABLE)
    .update({
      nome: category.nome,
      tipo: category.tipo,
      cliente: category.cliente
    })
    .eq('id', category.id)
    .select();

  if (error) {
    console.error('Erro ao atualizar categoria:', error);
    throw error;
  }

  console.log('Category updated successfully:', data?.[0]);
  return data?.[0];
}

// Delete a category
export async function deleteCategory(id: number) {
  console.log('Deleting category:', id);
  
  // Primeiro, verificar se a categoria é padrão
  const { data: categoryData, error: fetchError } = await supabase
    .from(CATEGORIES_TABLE)
    .select('padrao')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Erro ao verificar categoria:', fetchError);
    throw fetchError;
  }

  if (categoryData.padrao) {
    console.error('Categorias padrão não podem ser excluídas');
    throw new Error('Categorias padrão não podem ser excluídas');
  }

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
