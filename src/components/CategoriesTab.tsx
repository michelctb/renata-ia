
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Category, 
  fetchCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory 
} from '@/lib/categories';
import { Button } from '@/components/ui/button';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import CategoryForm from './CategoryForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const CategoriesTab = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  // Carregar categorias
  useEffect(() => {
    const loadCategories = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const data = await fetchCategories(user.id);
        setCategories(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        toast.error('Erro ao carregar as categorias. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategories();
  }, [user]);

  // Funções de gerenciamento
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  const handleDeleteRequest = (id: number) => {
    setCategoryToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteCategory(categoryToDelete);
      setCategories(prev => prev.filter(c => c.id !== categoryToDelete));
      toast.success('Categoria excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      toast.error('Erro ao excluir a categoria. Tente novamente.');
    } finally {
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsCategoryFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsCategoryFormOpen(false);
    setEditingCategory(null);
  };

  const handleSubmitCategory = async (category: Category) => {
    if (!user) return;
    
    try {
      if (category.id) {
        const updated = await updateCategory(category);
        setCategories(prev => 
          prev.map(c => (c.id === category.id ? updated : c))
        );
      } else {
        const added = await addCategory(category);
        setCategories(prev => [...prev, added]);
      }
    } catch (error) {
      console.error('Erro com categoria:', error);
      throw error;
    }
  };

  // Mostrar indicador de carregamento
  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-pulse-slow text-lg">Carregando categorias...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Categorias</h2>
        <Button onClick={handleAddNew}>
          <PlusIcon className="h-4 w-4 mr-1" />
          Nova Categoria
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma categoria cadastrada. Clique em "Nova Categoria" para adicionar.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.nome}</TableCell>
                <TableCell>
                  {category.tipo === 'entrada' && 'Entrada'}
                  {category.tipo === 'saída' && 'Saída'}
                  {category.tipo === 'ambos' && 'Ambos'}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="h-8 w-8 p-0 mr-1"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRequest(category.id!)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {user && (
        <CategoryForm
          isOpen={isCategoryFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitCategory}
          editingCategory={editingCategory}
          userId={user.id}
        />
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente esta categoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoriesTab;
