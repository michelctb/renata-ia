
import { useState } from 'react';

export function useTransactionReload() {
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);
  
  // Handle page reload after successful deletion
  const handleReloadAfterDelete = () => {
    console.log('Reloading page after successful deletion');
    window.location.reload();
  };

  return {
    deleteSuccessOpen,
    setDeleteSuccessOpen,
    handleReloadAfterDelete
  };
}
