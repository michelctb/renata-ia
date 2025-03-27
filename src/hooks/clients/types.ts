
import { Cliente } from '@/lib/clientes';

export interface ClientDataHookResult {
  clients: Cliente[];
  isLoading: boolean;
  loadClients: () => Promise<void>;
}

export interface ClientRecurrenceData {
  totalRecurrence: number;
  activePlans: {
    plan: string;
    count: number;
    value: number;
    totalValue: number;
  }[];
}
