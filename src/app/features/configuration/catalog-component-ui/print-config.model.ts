export interface PrintConfig {
  excludeSelectors: string[];
  includeSelectors: string[];
  margin: string;
  orientation: 'portrait' | 'landscape';
}

export const DEFAULT_PRINT_CONFIG: PrintConfig = {
  excludeSelectors: ['.sidebar', '.app-header', '.toolbar', '.no-print'],
  includeSelectors: ['.report-container', '.data-table'],
  margin: '10mm',
  orientation: 'portrait'
};
