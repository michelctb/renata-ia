
import { useState } from 'react';

/**
 * Custom hook for managing transaction list reloading after deletion.
 * Tracks deletion success state and provides a page reload function.
 * 
 * @returns {Object} Object containing deletion state and page reload handler
 * @property {boolean} deleteSuccessOpen - Whether the deletion success dialog is open
 * @property {Function} setDeleteSuccessOpen - Function to set the deletion success dialog state
 * @property {Function} handleReloadAfterDelete - Function to reload the page after deletion
 */
export function useTransactionReload() {
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);
  
  /**
   * Handles page reload after successful transaction deletion.
   * This is used to refresh the data on the page.
   */
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
