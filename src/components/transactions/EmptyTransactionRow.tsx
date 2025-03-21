
import { FolderOpenIcon } from 'lucide-react';

export interface EmptyTransactionRowProps {
  searchTerm: string;
}

export function EmptyTransactionRow({ searchTerm }: EmptyTransactionRowProps) {
  return (
    <tr>
      <td colSpan={6} className="px-4 py-8">
        <div className="flex flex-col items-center justify-center text-center">
          <FolderOpenIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
          <h3 className="font-medium text-gray-900 dark:text-white mb-1">
            {searchTerm ? 'Nenhuma transação encontrada' : 'Sem transações'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            {searchTerm
              ? `Não encontramos nenhuma transação correspondente a "${searchTerm}". Tente um termo diferente.`
              : 'Você ainda não registrou nenhuma transação. Use o botão "Nova Transação" para adicionar uma.'}
          </p>
        </div>
      </td>
    </tr>
  );
}
