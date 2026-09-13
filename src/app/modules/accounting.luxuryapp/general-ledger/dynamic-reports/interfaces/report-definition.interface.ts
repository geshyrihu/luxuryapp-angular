export interface IAccountFilter {
  accountNumbers: string[];
  rangeFrom?: string;
  rangeTo?: string;
  level?: number;
  excludeAccounts: string[];
}

export type IReportDataSource = 'contabilidad' | 'cobranza';
export type IReportColumnDataSource = 'contabilidad' | 'budget';

export interface IReportRow {
  id: string;
  type: 'account' | 'subtotal' | 'formula' | 'header' | 'spacer' | 'grandTotal';
  label: string;
  accountFilter?: IAccountFilter;
  sign: number;
  sourceRowIds: string[];
  formula?: string;
  position: number;
  bold: boolean;
  indent: number;
  showZero: boolean;
}

export interface IReportSection {
  id: string;
  title: string;
  position: number;
  rows: IReportRow[];
}

export interface IReportColumn {
  id: string;
  label: string;
  periodType: 'month' | 'accumulated' | 'annual' | 'quarterly';
  dataSource: IReportColumnDataSource;
  year: number;
  month?: number;
}

export interface IReportChangeEntry {
  date: string;
  user: string;
  description: string;
}

export interface IReportBody {
  sections: IReportSection[];
  columns: IReportColumn[];
}

export interface IReportDefinition {
  id: string;
  customerId?: string;
  name: string;
  description: string;
  isTemplate: boolean;
  visualizationType: 'table-simple' | 'table-twoColumn' | 'table-comparative' | 'table-budgetVsActual' | 'summary-cards';
  dataSource: IReportDataSource;
  periodType: 'monthly' | 'accumulated' | 'annual';
  isActive: boolean;
  body: IReportBody;
  createdAt: string;
  createdBy: string;
  changeHistory: IReportChangeEntry[];
}

export interface IReportDefinitionList {
  id: string;
  name: string;
  description: string;
  isTemplate: boolean;
  visualizationType: string;
  dataSource: string;
  createdAt: string;
  createdBy: string;
}

// Resultado ejecutado
export interface IReportResultRow {
  id: string;
  type: string;
  label: string;
  bold: boolean;
  indent: number;
  values: Record<string, number | null>;
}

export interface IReportResultSection {
  id: string;
  title: string;
  position: number;
  rows: IReportResultRow[];
}

export interface IReportResult {
  reportId: string;
  reportName: string;
  visualizationType: string;
  columns: IReportColumn[];
  sections: IReportResultSection[];
  warnings: string[];
}

export interface IAccountTreeNode {
  code: string;
  name: string;
  level: number;
  naturaleza: string;
  saldoInicial: number;
  acumuladoAnual: number;
  children: IAccountTreeNode[];
}

export interface IAccountFlatItem {
  code: string;
  name: string;
  level: number;
  parentCode?: string;
  naturaleza: string;
  saldoInicial: number;
  acumuladoAnual: number;
}

export interface IExecuteReportRequest {
  reportId: string;
  customerId: string;
  year: number;
  month?: number;
}
