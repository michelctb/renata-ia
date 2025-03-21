
// Re-export from client
export { supabase, FINANCIAL_TABLE, CLIENTES_TABLE } from './client';

// Re-export types
export type { Transaction, Cliente } from './types';

// Re-export utility functions
export { formatPhoneForWhatsApp, getClientPhone } from './utils';

// Re-export transaction operations
export { 
  fetchTransactions, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction 
} from './transactions';

// Re-export client operations
export {
  fetchClientes,
  fetchConsultorClients,
  fetchClienteById,
  addCliente,
  updateCliente,
  deleteCliente
} from './clients';
