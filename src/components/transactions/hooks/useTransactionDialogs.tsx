
import { useState } from 'react';
import { Transaction } from '@/lib/supabase/types';

export function useTransactionDialogs() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
  };
  
  return {
    isFormOpen,
    setIsFormOpen,
    handleCloseForm
  };
}
