
// Re-export fetch operations
export {
  fetchMetasCategorias,
  fetchMetasPeriodo
} from './fetchOperations';

// Re-export CRUD operations
export {
  addMetaCategoria,
  updateMetaCategoria,
  deleteMetaCategoria
} from './crudOperations';

// Re-export copy operations
export {
  copyMetasFromPreviousPeriod
} from './copyOperations';
