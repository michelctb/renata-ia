
import { Cliente } from '@/lib/clientes';

export interface ClientDataHookResult {
  clients: Cliente[];
  isLoading: boolean;
  loadClients: () => Promise<void>;
}
