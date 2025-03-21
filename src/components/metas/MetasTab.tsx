
import { useState } from 'react';
import { MetaForm } from './MetaForm';
import { MetasList } from './MetasList';
import { MetaCategoria } from '@/lib/metas/types';
import { useMetasData } from './hooks/useMetasData';
import { useCategoriesWithMetas } from '@/hooks/useCategoriesWithMetas';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { MetasHeader } from './components/MetasHeader';
import { MetasEmptyState } from './components/MetasEmptyState';
import { Tabs, TabsContent } from '@/components/ui/tabs';

interface MetasTabProps {
  userId: string | undefined;
}

export function MetasTab({ userId }: MetasTabProps) {
  const { metas, isLoading, handleSaveMeta, handleDeleteMeta } = useMetasData(userId);
  const { categoriesWithMetas, isLoading: isCategoriesLoading, refreshData } = useCategoriesWithMetas(userId);
  
  const [showForm, setShowForm] = useState(false);
  const [metaAtual, setMetaAtual] = useState<MetaCategoria | null>(null);

  const handleAddClick = () => {
    setMetaAtual(null);
    setShowForm(true);
  };

  const handleEditClick = (meta: MetaCategoria) => {
    setMetaAtual(meta);
    setShowForm(true);
  };

  const handleFormSubmit = async (meta: MetaCategoria) => {
    await handleSaveMeta(meta);
    setShowForm(false);
    setMetaAtual(null);
    refreshData(); // Refresh categories with metas
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setMetaAtual(null);
  };

  // Loading state
  if (isLoading || isCategoriesLoading) {
    return (
      <div className="py-10">
        <div className="container">
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">Carregando metas...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show form or list based on state
  return (
    <div className="py-10">
      <div className="container max-w-[1000px]">
        <MetasHeader />

        {/* Show form if requested */}
        <Tabs defaultValue="metas">
          <TabsContent value="metas">
            {showForm ? (
              <MetaForm
                userId={userId || ''}
                metaAtual={metaAtual}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                availableCategories={categoriesWithMetas}
              />
            ) : (
              <>
                {/* Add button */}
                <div className="mb-6">
                  <Button onClick={handleAddClick} className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Meta
                  </Button>
                </div>

                {/* Show list or empty state */}
                {metas.length > 0 ? (
                  <MetasList
                    metas={metas}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteMeta}
                    categoriesWithMetas={categoriesWithMetas}
                  />
                ) : (
                  <MetasEmptyState onAddMeta={handleAddClick} />
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
