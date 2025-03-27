
// Este arquivo serve apenas como um ponto de entrada para manter a compatibilidade
// com o código existente. Todas as funcionalidades foram movidas para arquivos
// mais específicos em src/hooks/reports/

import { useReportData } from './reports/useReportData';
export { normalizeOperationType, getMonthNumberFromName } from './reports/reportDataUtils';
export type { ReportData } from './reports/types';

export { useReportData };
