// Modelos de Live Preview para el canvas interactivo
export interface ILivePreviewSection {
  label: string;
  rows: ILivePreviewRow[];
}

export interface ILivePreviewRow {
  rowId: string;
  label: string;
  rowType: 'account' | 'formula' | 'subtotal';
  accountNumbers: string[];
  formula?: string;
  multiplier: number;
}

export interface ILivePreviewRequest {
  customerId: string;
  year: number;
  period: number;
  empresa: string;
  sections: ILivePreviewSection[];
}

export interface ILivePreviewResult {
  rowValues: Record<string, number>;
  grandTotal: number;
  warnings: string[];
}

// Modelos de canvas (estado local del builder)
export interface ICanvasRow {
  rowId: string;
  label: string;
  rowType: 'account' | 'formula' | 'subtotal' | 'header';
  accountNumbers: string[];   // cuentas asignadas via drag & drop
  formula?: string;           // expresion: "{R001} + {R002}"
  multiplier: number;         // 1 = suma, -1 = resta
  // Estado reactivo calculado
  computedValue?: number;
  isLoading?: boolean;
}

export interface ICanvasSection {
  sectionId: string;
  title: string;
  rows: ICanvasRow[];
}
