// export enum FinancialReportRowType {
//   Header = 'Header',
//   AccountGroup = 'AccountGroup',
//   Formula = 'Formula',
//   Total = 'Total',
//   Blank = 'Blank'
// }

// export enum FinancialReportSourceType {
//   SpecificAccount = 0,
//   RangeAccount = 1,
//   EmpresaTotal = 2,
//   AccountType = 3,
//   AccountLevel = 4,
//   DynamicSelector = 5
// }

// export interface FinancialReportRowSource {
//   id?: string;
//   rowId?: string;
//   sourceType: FinancialReportSourceType;
//   value: string;
// }

// export interface FinancialReportRow {
//   id?: string;
//   reportId?: string;
//   rowType: string;
//   name: string;
//   order: number;
//   parentRowId?: string | null;
//   inverseSign: boolean;
//   bold: boolean;
//   formula?: string;
//   sources: FinancialReportRowSource[];
//   // UI Helper
//   children?: FinancialReportRow[];
//   expanded?: boolean;
// }

// export interface FinancialReport {
//   id?: string;
//   name: string;
//   code: string;
//   description: string;
//   sortOrder: number;
//   rows: FinancialReportRow[];
// }

// export interface FinancialReportResultDTO {
//   reportId: string;
//   code: string;
//   reportName: string;
//   year: number;
//   month: number;
//   monthName: string;
//   companyName: string;
//   sortOrder: number;
//   rows: ReportRowResultDTO[];
// }

// export interface ReportRowResultDTO {
//   rowId: string;
//   name: string;
//   rowType: FinancialReportRowType;
//   value: number;
//   budget: number;
//   variance: number;
//   bold: boolean;
//   level: number;
//   order: number;
//   // Matrix View Support
//   monthlyValues?: number[];
//   monthlyBudgets?: number[];
//   children: ReportRowResultDTO[];
// }









