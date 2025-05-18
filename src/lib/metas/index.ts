
// Re-export types
export type { MetaCategoria, MetaProgresso } from './types';

// Re-export constants
export { METAS_TABLE, PERIODO_OPTIONS, LIMITE_BAIXO, LIMITE_MEDIO, LIMITE_ALTO } from './constants';

// Re-export operations
export {
  fetchMetasCategorias,
  fetchMetasPeriodo,
  addMetaCategoria,
  updateMetaCategoria,
  deleteMetaCategoria,
  copyMetasFromPreviousPeriod
} from './operations';
