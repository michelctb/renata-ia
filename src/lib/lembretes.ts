
// Backward compatibility file
// This file re-exports everything from the new modular structure

export type { Lembrete } from './lembretes/types';
export { LEMBRETES_TABLE } from './lembretes/constants';
export {
  fetchLembretes,
  addLembrete,
  updateLembrete,
  deleteLembrete
} from './lembretes/operations';
