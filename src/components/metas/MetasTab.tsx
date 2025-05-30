
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
import { Card, CardContent } from '@/components/ui/card';
import { CopyMetasButton } from './components/CopyMetasButton';
import { MonthSelector } from './components/MonthSelector';
import { usePeriodoDateRange } from './hooks/usePeriodoDateRange';

interface MetasTabProps {
  userId: string | undefined;
}

export function MetasTab({ userId }: MetasTabProps) {
  const { currentDate, changeMonth } = usePeriodoDateRange();
  const currentMonth = currentDate.getMonth() + 1; // +1 porque getMonth() retorna 0-11
  const currentYear = currentDate.getFullYear();
  
  const { metas, isLoading, handleSaveMeta, handleDeleteMeta, refreshMetas } = useMetasData({
    userId, 
    mesReferencia: currentMonth,
    anoReferencia: currentYear
  });
  
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

  const handleCopySuccess = () => {
    refreshMetas();
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
        
        {/* Seletor de mês */}
        <div className="mb-6">
          <MonthSelector 
            currentDate={currentDate}
            onMonthChange={changeMonth}
          />
        </div>

        {/* Show form if requested */}
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
            {/* Actions bar with add and copy buttons */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3 justify-between items-center">
                  <div>
                    <Button onClick={handleAddClick} className="mr-2">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Nova Meta
                    </Button>
                    
                    {/* Add copy button */}
                    {userId && (
                      <CopyMetasButton 
                        userId={userId} 
                        onCopySuccess={handleCopySuccess} 
                        targetMonth={currentMonth}
                        targetYear={currentYear}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

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
      </div>
    </div>
  );
}
