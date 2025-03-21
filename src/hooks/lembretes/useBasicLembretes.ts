
import { useState, useEffect, useCallback } from 'react';
import { fetchLembretes, Lembrete } from '@/lib/lembretes';
import { toast } from 'sonner';

/**
 * Basic hook for loading lembretes data.
 * Handles fetching lembretes and provides loading state.
 * 
 * @param {string | undefined} userId - The ID of the current user
 * @returns {Object} Object containing lembretes data and loading state
 * @property {Lembrete[]} lembretes - The list of lembretes for the current user
 * @property {boolean} isLoading - Whether the lembretes are currently being loaded
 * @property {Function} loadLembretes - Function to reload lembretes data
 * @property {Function} setLembretes - Function to update the lembretes state
 */
export function useBasicLembretes(userId: string | undefined) {
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Loads lembretes from the database.
   * Used for initial loading and refreshing after operations.
   */
  const loadLembretes = useCallback(async () => {
    if (!userId) {
      console.log('No userId, skipping loadLembretes');
      return;
    }
    
    try {
      console.log('Loading lembretes...');
      setIsLoading(true);
      const data = await fetchLembretes(userId);
      console.log(`Loaded ${data.length} lembretes for user ${userId}`);
      
      // Always use a functional update to avoid race conditions
      setLembretes(prevState => {
        console.log('Updating lembretes state from:', prevState.length, 'items to', data.length, 'items');
        return data;
      });
    } catch (error) {
      console.error('Error loading lembretes:', error);
      toast.error('Erro ao carregar lembretes. Atualize a página.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Initial load on component mount
  useEffect(() => {
    console.log('User effect triggered, loading lembretes');
    loadLembretes();
  }, [loadLembretes]);

  return {
    lembretes,
    setLembretes,
    isLoading,
    loadLembretes
  };
}
