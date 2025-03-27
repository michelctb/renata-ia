
import { Transaction } from '@/lib/supabase/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TransactionTableHeader } from './TransactionTableHeader';
import { TransactionRow } from './TransactionRow';
import { EmptyTransactionRow } from './EmptyTransactionRow';
import { Table, TableBody } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import { BatchEditButton } from './BatchEditButton';
import { Category } from '@/lib/categories';
import { BatchEditDialog } from './batch-edit/BatchEditDialog';

interface TransactionTableContainerProps {
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: number) => void;
  isUserActive: boolean;
  isReadOnly: boolean;
  filteringData: {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    filteredTransactions: Transaction[];
    hasFilters: boolean;
    totalReceived: number;
    totalSpent: number;
    selectedCategory?: string | null; // Adicionando selectedCategory
  };
  batchEdit?: {
    selectedTransactions: Transaction[];
    handleSelectTransaction: (id: number, selected: boolean) => void;
    handleSelectAll: (checked: boolean) => void;
    openBatchEdit: () => void;
    isBatchEditOpen: boolean;
    closeBatchEdit: () => void;
    processBatchEdit: (updates: Partial<Transaction>) => Promise<void>;
    isUpdating: boolean;
  };
  categories?: Category[];
  isLoadingCategories?: boolean;
}

/**
 * Container component for the transaction table
 * Used across user, consultant, and client views
 */
export function TransactionTableContainer({
  transactions,
  onEditTransaction,
  onDeleteTransaction,
  isUserActive,
  isReadOnly,
  filteringData,
  batchEdit,
  categories = [],
  isLoadingCategories = false
}: TransactionTableContainerProps) {
  const {
    filteredTransactions,
    searchTerm,
    selectedCategory
  } = filteringData;
  
  const isMobile = useIsMobile();
  
  // Verifica se há transações selecionadas
  const hasSelectedTransactions = batchEdit && 
    filteredTransactions.some(transaction => transaction.selected);
  
  // Verifica se todas as transações estão selecionadas
  const allSelected = filteredTransactions.length > 0 && 
    filteredTransactions.every(transaction => transaction.selected);
  
  // Conta quantas transações estão selecionadas
  const selectedCount = filteredTransactions.filter(transaction => transaction.selected).length;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            Transações
            {selectedCategory && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                Filtrando por: {selectedCategory}
              </span>
            )}
          </div>
          
          {batchEdit && !isReadOnly && (
            <BatchEditButton 
              onClick={batchEdit.openBatchEdit}
              count={selectedCount}
              disabled={!isUserActive}
            />
          )}
        </div>
      </div>

      <ScrollArea className="h-[400px]" orientation="both">
        <div className={isMobile ? "min-w-[650px]" : "min-w-full"}>
          <Table>
            <TransactionTableHeader 
              isReadOnly={isReadOnly} 
              hasSelection={!!batchEdit && !isReadOnly}
              onSelectAll={batchEdit?.handleSelectAll}
              allSelected={allSelected}
            />
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={() => onEditTransaction(transaction)}
                    onDelete={() => onDeleteTransaction(transaction.id as number)}
                    isUserActive={isUserActive}
                    isReadOnly={isReadOnly}
                    hasSelection={!!batchEdit && !isReadOnly}
                    onSelectTransaction={batchEdit?.handleSelectTransaction}
                  />
                ))
              ) : (
                <EmptyTransactionRow searchTerm={searchTerm} />
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>

      {batchEdit && (
        <BatchEditDialog 
          isOpen={batchEdit.isBatchEditOpen}
          onClose={batchEdit.closeBatchEdit}
          onSubmit={batchEdit.processBatchEdit}
          selectedTransactions={batchEdit.selectedTransactions}
          categories={categories}
          isLoadingCategories={isLoadingCategories}
        />
      )}
    </div>
  );
}
