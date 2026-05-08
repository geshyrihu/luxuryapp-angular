// import { CommonModule } from "@angular/common";
// import { Component, effect, inject, OnInit, signal } from "@angular/core";
// import { toSignal } from "@angular/core/rxjs-interop";
// import { FormsModule } from "@angular/forms";
// import { ActivatedRoute } from "@angular/router";
// import { TreeNode } from "primeng/api";
// import { CheckboxModule } from "primeng/checkbox";
// import { TreeTableModule } from "primeng/treetable";
// import { ApiResponseService } from "src/app/core/services/api-response.service";
// import {
//   FinancialReportResultDTO,
//   FinancialReportRowType,
//   ReportRowResultDTO,
// } from "../../contabilidad/reportes-estados-financieros/models/financial-report.models";

// @Component({
//   selector: "app-public-financial-report",
//   templateUrl: "./public-financial-report.html",

//   imports: [CommonModule, TreeTableModule, CheckboxModule, FormsModule],
// })
// export class PublicFinancialReport implements OnInit {
//   private route = inject(ActivatedRoute);
//   private apiResponseS = inject(ApiResponseService);

//   loading = signal(true);
//   results = signal<
//     {
//       dto: FinancialReportResultDTO;
//       nodes: TreeNode[];
//       isBalanceSheet: boolean;
//       leftNodes: TreeNode[];
//       rightNodes: TreeNode[];
//     }[]
//   >([]);

//   showZeros = signal(false);
//   FinancialReportRowType = FinancialReportRowType;

//   // Parameters
//   customerId: string = "";
//   year: number = 0;
//   month: number = 0;

//   private paramsSignal = toSignal(this.route.paramMap);

//   constructor() {
//     effect(() => {
//       const params = this.paramsSignal();
//       if (params) {
//         const cId = params.get("customerId");
//         const y = params.get("year");
//         const m = params.get("month");
//         if (cId && y && m) {
//           this.customerId = cId;
//           this.year = +y;
//           this.month = +m;
//           this.loadReports();
//         }
//       }
//     });
//   }

//   ngOnInit() {
//     // Logic moved to effect
//   }

//   loadReports() {
//     this.loading.set(true);
//     const url = `FinancialReport/Public/${this.customerId}/${this.year}/${this.month}`;

//     this.apiResponseS
//       .onGetList<FinancialReportResultDTO[]>(url)
//       .then((res) => {
//         if (!res) {
//           this.loading.set(false);
//           return;
//         }

//         const data = res as unknown as FinancialReportResultDTO[]; // Force cast to be sure if generic inference is failing

//         const processed = data
//           .map((dto) => {
//             const nodes = this.buildResultNodes(dto.rows, this.showZeros());
//             const isBalanceSheet = this.checkIsBalanceSheet(dto);

//             let leftNodes: TreeNode[] = [];
//             let rightNodes: TreeNode[] = [];

//             if (isBalanceSheet) {
//               leftNodes = nodes.filter((n) => {
//                 const name = n.data.name.toUpperCase();
//                 return name.includes("ACTIVO");
//               });

//               rightNodes = nodes.filter((n) => {
//                 const name = n.data.name.toUpperCase();
//                 return name.includes("PASIVO") || name.includes("CAPITAL");
//               });
//             }

//             return {
//               dto,
//               nodes,
//               isBalanceSheet,
//               leftNodes,
//               rightNodes,
//             };
//           })
//           .sort((a, b) => (a.dto.sortOrder ?? 0) - (b.dto.sortOrder ?? 0));

//         this.results.set(processed);
//         this.loading.set(false);
//       })
//       .catch(() => this.loading.set(false));
//   }

//   // --- Logic copied from ReportViewer ---

//   toggleZeros() {
//     this.showZeros.update((v) => !v);
//     // Rebuild nodes logic
//     const currentResults = this.results();
//     const reprocessed = currentResults.map((item) => {
//       const nodes = this.buildResultNodes(item.dto.rows, this.showZeros());
//       let leftNodes: TreeNode[] = [];
//       let rightNodes: TreeNode[] = [];

//       if (item.isBalanceSheet) {
//         leftNodes = nodes.filter((n) => {
//           const name = n.data.name.toUpperCase();
//           return name.includes("ACTIVO");
//         });

//         rightNodes = nodes.filter((n) => {
//           const name = n.data.name.toUpperCase();
//           return name.includes("PASIVO") || name.includes("CAPITAL");
//         });
//       }
//       return { ...item, nodes, leftNodes, rightNodes };
//     });
//     this.results.set(reprocessed);
//   }

//   buildResultNodes(rows: ReportRowResultDTO[], showZeros: boolean): TreeNode[] {
//     const mapNode = (row: ReportRowResultDTO): TreeNode | null => {
//       // Filter Zeros Logic
//       if (!showZeros && this.isZeroRow(row)) {
//         return null;
//       }

//       const children = (row.children || [])
//         .map(mapNode)
//         .filter((n): n is TreeNode => n !== null);

//       if (!showZeros && children.length === 0 && this.isZeroRow(row)) {
//         return null;
//       }

//       return {
//         data: row,
//         children: children,
//         expanded: true, // Auto expand by default
//       };
//     };

//     return rows.map(mapNode).filter((n): n is TreeNode => n !== null);
//   }

//   isZeroRow(row: ReportRowResultDTO): boolean {
//     // Basic check: value, budget, variance are 0
//     // But for matrix view we must check monthly arrays too?
//     // Simplifying: if value and budget are 0.
//     return Math.abs(row.value) < 0.01 && Math.abs(row.budget) < 0.01;
//   }

//   checkIsBalanceSheet(dto: FinancialReportResultDTO): boolean {
//     const name = dto.reportName.toUpperCase();
//     if (name.includes("POSICIÓN FINANCIERA") || name.includes("BALANCE"))
//       return true;
//     const rowNames = dto.rows.map((r) => r.name.toUpperCase());
//     return (
//       rowNames.some((n) => n.includes("ACTIVO")) &&
//       (rowNames.some((n) => n.includes("PASIVO")) ||
//         rowNames.some((n) => n.includes("CAPITAL")))
//     );
//   }

//   expandToLevel(level: number) {
//     this.results.update((items) =>
//       items.map((item) => {
//         this.recurseExpand(item.nodes, level, 0);
//         return { ...item }; // trigger signal update check
//       }),
//     );
//   }

//   recurseExpand(nodes: TreeNode[], targetLevel: number, currentLevel: number) {
//     nodes.forEach((node) => {
//       node.expanded = currentLevel < targetLevel;
//       if (node.children) {
//         this.recurseExpand(node.children, targetLevel, currentLevel + 1);
//       }
//     });
//   }

//   collapseAll() {
//     this.results.update((items) =>
//       items.map((item) => {
//         this.recurseExpand(item.nodes, 0, 0); // Collapse all (level 0 expanded? no, level < 0 is impossible)
//         // Adjust logic: targetLevel 0 means only root is expanded?
//         // collapseAll usually means expanded = false for all.
//         this.recurseExpandForCollapse(item.nodes);
//         return { ...item };
//       }),
//     );
//   }

//   recurseExpandForCollapse(nodes: TreeNode[]) {
//     nodes.forEach((n) => {
//       n.expanded = false;
//       if (n.children) this.recurseExpandForCollapse(n.children);
//     });
//   }

//   // Helpers
//   isBudgetView(dto: FinancialReportResultDTO): boolean {
//     return (
//       dto.rows.some(
//         (r) => r.monthlyBudgets && r.monthlyBudgets.some((b) => b !== 0),
//       ) || dto.reportName.toUpperCase().includes("PRESUPUEST")
//     );
//   }

//   isMatrixView(dto: FinancialReportResultDTO): boolean {
//     // If it has monthly values but is not strictly a budget view (or we want to show matrix)
//     // Usually determined by report type config? For now use a heuristic.
//     return (
//       !this.isBudgetView(dto) &&
//       dto.rows.some(
//         (r) => r.monthlyValues && r.monthlyValues.some((v) => v !== 0),
//       )
//     );
//   }

//   hasBudgetColumns(reportName: string): boolean {
//     return (
//       reportName.toUpperCase().includes("RESULTADOS") ||
//       reportName.toUpperCase().includes("PRESUPUEST")
//     );
//   }

//   getBudgetMonths(dto: FinancialReportResultDTO): number[] {
//     const currentMonth = dto.month; // e.g. 7 (July)
//     // Return array 1..currentMonth
//     return Array.from({ length: currentMonth }, (_, i) => i + 1);
//   }

//   getMatrixColumns(dto: FinancialReportResultDTO): number[] {
//     return Array.from({ length: 12 }, (_, i) => i + 1);
//   }

//   getMonthName(monthIndex: number): string {
//     const months = [
//       "",
//       "ENE",
//       "FEB",
//       "MAR",
//       "ABR",
//       "MAY",
//       "JUN",
//       "JUL",
//       "AGO",
//       "SEP",
//       "OCT",
//       "NOV",
//       "DIC",
//     ];
//     return months[monthIndex] || "";
//   }

//   // Row Styling
//   getRowClass(row: ReportRowResultDTO): string {
//     const name = row.name.toUpperCase();
//     if (name.includes("FONDO DE RESERVA") || name.includes("PATRIMONIO")) {
//       return "text-emerald-700 font-medium";
//     }
//     if (
//       name.includes("REMANENTE") ||
//       name.includes("DEPRECIACION") ||
//       name.includes("SUPERAVIT") ||
//       name.includes("DÉFICIT")
//     ) {
//       return "text-amber-700 font-medium";
//     }
//     return "text-gray-700";
//   }

//   getBudgetRowClass(row: ReportRowResultDTO): string {
//     if (row.rowType === FinancialReportRowType.Total.toString()) {
//       return "bg-gray-100 font-bold text-gray-900 border-t border-gray-300";
//     }
//     if (row.level === 0) {
//       return "bg-gray-50 font-bold text-gray-800 border-b border-gray-200 tracking-wide";
//     }
//     if (row.level === 1) {
//       return "font-semibold text-gray-700 bg-gray-50/50";
//     }
//     return "text-gray-600 hover:bg-gray-50 transition-colors duration-150";
//   }

//   // Value Helpers
//   getMonthlyValue(row: ReportRowResultDTO, month: number): number {
//     return row.monthlyValues ? row.monthlyValues[month] : 0;
//   }

//   getAccumulatedValue(row: ReportRowResultDTO, maxMonth: number): number {
//     if (!row.monthlyValues) return 0;
//     let sum = 0;
//     for (let i = 1; i <= maxMonth; i++) {
//       sum += row.monthlyValues[i];
//     }
//     return sum;
//   }

//   getLastMonthlyBudget(row: ReportRowResultDTO, currentMonth: number): number {
//     if (!row.monthlyBudgets) return 0;
//     const val = row.monthlyBudgets[currentMonth];
//     if (val !== 0) return val;
//     for (let m = currentMonth - 1; m >= 1; m--) {
//       if (row.monthlyBudgets[m] !== 0) return row.monthlyBudgets[m];
//     }
//     return 0;
//   }

//   getBudgetRestante(row: ReportRowResultDTO, maxMonth: number): number {
//     const accumulatedReal = this.getAccumulatedValue(row, maxMonth);
//     const annualBudget = row.budget;
//     return annualBudget - accumulatedReal;
//   }

//   formatValue(value: number): string {
//     if (Math.abs(value) < 0.01) return "-";
//     return new Intl.NumberFormat("en-US", {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(value);
//   }

//   isRowLeaf(rowNode: any): boolean {
//     return !rowNode.node.children || rowNode.node.children.length === 0;
//   }
// }









