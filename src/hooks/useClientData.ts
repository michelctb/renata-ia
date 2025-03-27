
// Este arquivo serve apenas como um ponto de entrada para manter a compatibilidade
// com o código existente. Todas as funcionalidades foram movidas para arquivos
// mais específicos em src/hooks/clients/

import { useClientData } from './clients/useClientData';
export type { ClientDataHookResult } from './clients/types';

export { useClientData };
